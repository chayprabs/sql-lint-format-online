export const SAMPLE_RISKY_UPDATE = `UPDATE users SET active = true;`;

export const SAMPLE_MESSY_SELECT = `select * from orders o, customers c where o.customer_id=c.id`;

export const SAMPLE_BIGQUERY = `SELECT user_id, COUNT(*) AS cnt
FROM \`project.dataset.events\`
WHERE event_date = CURRENT_DATE()
GROUP BY user_id`;

export const SAMPLE_SNOWFLAKE = `SELECT employee_id, name
FROM employees
QUALIFY ROW_NUMBER() OVER (PARTITION BY dept ORDER BY hire_date) = 1`;
