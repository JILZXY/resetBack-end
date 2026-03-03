import { Pool } from 'pg';

async function main() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:qwerty123@137.184.39.253:5432/reset",
  });

  try {
    const res = await pool.query(`SELECT enum_range(NULL::auth."UserRole")`);
    console.log(res.rows);
  } catch (e) {
    console.error("DB ERROR:", e);
  } finally {
    await pool.end();
  }
}

main();
