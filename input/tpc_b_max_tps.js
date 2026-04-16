import sql from "k6/x/sql";
import postgres from "k6/x/sql/driver/postgres";
import { sleep, check } from "k6";

// ====================== CONFIG ======================
const configRaw = open("./tpc_b_max_tps.json");
const config = JSON.parse(configRaw);

const db = sql.open(postgres, config.database.connectionString);

// ====================== WEIGHTS ======================
const w = config.weights || { select: 45, update: 35, insert: 20 };

export default function () {
  const customerId = Math.floor(Math.random() * 599) + 1;
  const inventoryId = Math.floor(Math.random() * 4581) + 1;

  const rand = Math.random() * 100;
  let success = true;

  try {
    if (rand < w.select) {
      db.query(
        "SELECT first_name, last_name FROM customer WHERE customer_id = $1",
        customerId,
      );
    } else if (rand < w.select + w.update) {
      db.exec(
        `
        UPDATE payment 
        SET amount = amount + 0.01 
        WHERE payment_id = (
          SELECT payment_id 
          FROM payment 
          WHERE customer_id = $1 
          ORDER BY payment_id DESC 
          LIMIT 1
        )
      `,
        customerId,
      );
    } else {
      db.exec(
        `
        INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id)
        VALUES (NOW(), $1, $2, 1)
      `,
        inventoryId,
        customerId,
      );
    }
  } catch (e) {
    success = false;
  }

  check(success, {
    "transaction succeeded": (s) => s === true,
  });

  const tt = config.thinkTime || { min: 0.05, max: 0.15 };
  sleep(tt.min + Math.random() * (tt.max - tt.min));
}

// ====================== OPTIONS ======================
export const options = {
  scenarios: {
    tpcb: {
      executor: config.load.executor || "ramping-vus",
      startVUs: config.load.startVUs || 5,
      stages: config.load.stages,
      gracefulRampDown: config.load.gracefulRampDown || "10s",
    },
  },
  thresholds: config.thresholds || {
    checks: ["rate>0.95"],
    iteration_duration: ["p(95)<200"],
  },
};

export function teardown() {
  db.close();
}
