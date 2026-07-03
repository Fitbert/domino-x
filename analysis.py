import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine
import matplotlib.pyplot as plt

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

# Pull data straight from your SQL query into a DataFrame
query = """
SELECT 
    p.category,
    o.order_date,
    oi.quantity,
    oi.unit_price_at_sale
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'Completed'
"""

df = pd.read_sql(query, engine)
print(df.head())
print(df.shape)


# Calculate revenue per line item
df['revenue'] = df['quantity'] * df['unit_price_at_sale']

# Total revenue by category
category_revenue = df.groupby('category')['revenue'].sum().sort_values(ascending=False).head(15)
print(category_revenue)

plt.figure(figsize=(10, 6))
category_revenue.plot(kind='bar', color='steelblue')
plt.title('Total Revenue by Category')
plt.xlabel('Category')
plt.ylabel('Revenue ($)')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('revenue_by_category.png')
plt.show()

# Revenue trend over time
df['order_date'] = pd.to_datetime(df['order_date'])
monthly_revenue = df.groupby(df['order_date'].dt.to_period('M'))['revenue'].sum()

plt.figure(figsize=(10, 6))
monthly_revenue.plot(kind='line', marker='o', color='darkgreen')
plt.title('Monthly Revenue Trend')
plt.xlabel('Month')
plt.ylabel('Revenue ($)')
plt.tight_layout()
plt.savefig('monthly_revenue_trend.png')
plt.show()