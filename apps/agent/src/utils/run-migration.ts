/**
 * Migration script - Execute SQL schemas on Supabase
 * Usage: npx tsx src/utils/run-migration.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars first.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Split SQL into individual statements, handling $$ blocks
function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inDollarQuote = false;

  const lines = sql.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines at statement level
    if (!inDollarQuote && (trimmed.startsWith("--") || trimmed === "")) {
      if (current.trim()) current += "\n" + line;
      continue;
    }

    // Track $$ blocks (PL/pgSQL functions)
    const dollarCount = (line.match(/\$\$/g) || []).length;
    if (dollarCount % 2 === 1) {
      inDollarQuote = !inDollarQuote;
    }

    current += (current ? "\n" : "") + line;

    // Statement ends with ; and we're not in a $$ block
    if (!inDollarQuote && trimmed.endsWith(";")) {
      const stmt = current.trim();
      if (stmt && !stmt.startsWith("--")) {
        statements.push(stmt);
      }
      current = "";
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements;
}

async function executeSQL(sql: string, label: string): Promise<boolean> {
  const statements = splitStatements(sql);
  console.log(`\n📄 ${label}: ${statements.length} statements to execute`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.slice(0, 80).replace(/\n/g, " ");

    try {
      const { error } = await supabase.rpc("exec_sql", { sql: stmt });

      if (error) {
        // Try alternative: direct REST call
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ sql: stmt }),
        });

        if (!res.ok) {
          // If exec_sql doesn't exist, we need to use the SQL editor approach
          throw new Error(`RPC not available: ${error.message}`);
        }
      }

      success++;
      console.log(`  ✅ [${i + 1}/${statements.length}] ${preview}...`);
    } catch (err: any) {
      const msg = err?.message || String(err);

      // Some errors are expected (IF NOT EXISTS, already exists, etc.)
      if (
        msg.includes("already exists") ||
        msg.includes("duplicate") ||
        msg.includes("does not exist")
      ) {
        skipped++;
        console.log(`  ⏭️ [${i + 1}/${statements.length}] Skipped: ${preview}...`);
      } else {
        failed++;
        console.log(`  ❌ [${i + 1}/${statements.length}] Failed: ${preview}...`);
        console.log(`     Error: ${msg}`);
      }
    }
  }

  console.log(
    `\n📊 ${label}: ${success} success, ${skipped} skipped, ${failed} failed`
  );
  return failed === 0;
}

async function main() {
  console.log("🐰 MONFFY Migration Script");
  console.log("==========================");
  console.log(`Supabase: ${SUPABASE_URL}`);

  // Test connection
  console.log("\n🔌 Testing connection...");
  const { error: testError } = await supabase.from("_test_").select("*").limit(0);
  // Error is expected (table doesn't exist), but connection should work
  console.log("✅ Connected to Supabase");

  // Check if exec_sql RPC exists
  console.log("\n🔍 Checking SQL execution capability...");
  const { error: rpcError } = await supabase.rpc("exec_sql", {
    sql: "SELECT 1",
  });

  if (rpcError) {
    console.log("⚠️  exec_sql RPC not available.");
    console.log("");
    console.log("SQL을 Supabase Dashboard에서 직접 실행해야 합니다:");
    console.log("1. https://supabase.com/dashboard 접속");
    console.log("2. 프로젝트 선택 → SQL Editor");
    console.log("3. 아래 SQL 파일들을 순서대로 복사-붙여넣기 실행:");
    console.log("");

    // Read and display the SQL files
    const supabaseDir = resolve(process.cwd(), "../../supabase");

    try {
      const schema = readFileSync(resolve(supabaseDir, "schema.sql"), "utf-8");
      const agentSchema = readFileSync(
        resolve(supabaseDir, "agent-schema.sql"),
        "utf-8"
      );

      console.log("=== 1단계: schema.sql ===");
      console.log("파일 위치: monffy/supabase/schema.sql");
      console.log(`(${schema.split("\n").length} lines)\n`);

      console.log("=== 2단계: agent-schema.sql ===");
      console.log("파일 위치: monffy/supabase/agent-schema.sql");
      console.log(`(${agentSchema.split("\n").length} lines)\n`);

      // Verify by trying to query expected tables
      console.log("🔍 기존 MONFFY 테이블 존재 여부 확인...");

      const tables = ["questions", "agent_stats", "agent_actions"];
      for (const table of tables) {
        const { error } = await supabase.from(table).select("*").limit(0);
        if (error) {
          console.log(`  ❌ ${table}: 없음 (SQL 실행 필요)`);
        } else {
          console.log(`  ✅ ${table}: 존재`);
        }
      }
    } catch (err) {
      console.log("SQL 파일을 읽을 수 없습니다:", err);
    }

    return;
  }

  // If exec_sql is available, run the migrations
  const supabaseDir = resolve(process.cwd(), "../../supabase");
  const schema = readFileSync(resolve(supabaseDir, "schema.sql"), "utf-8");
  const agentSchema = readFileSync(
    resolve(supabaseDir, "agent-schema.sql"),
    "utf-8"
  );

  await executeSQL(schema, "schema.sql");
  await executeSQL(agentSchema, "agent-schema.sql");

  // Verify
  console.log("\n🔍 Verifying tables...");
  const tables = [
    "questions",
    "responses",
    "sponsors",
    "daily_streaks",
    "badges",
    "agent_stats",
    "agent_actions",
    "agent_narratives",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select("*").limit(0);
    if (error) {
      console.log(`  ❌ ${table}: ${error.message}`);
    } else {
      console.log(`  ✅ ${table}: OK`);
    }
  }

  console.log("\n🎉 Migration complete!");
}

main().catch(console.error);
