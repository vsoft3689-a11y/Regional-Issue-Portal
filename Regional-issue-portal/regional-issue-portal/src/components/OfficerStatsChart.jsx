import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OfficerStatsChart({ stats }) {
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="card shadow-sm border-0 text-center p-4">
        <p className="text-muted mb-0">No statistics available yet.</p>
      </div>
    );
  }

  const data = Object.entries(stats).map(([key, value]) => ({
    name: key.replace(/_/g, " "),
    value,
  }));

  const COLORS = ["#0d6efd", "#ffc107", "#198754", "#dc3545", "#6610f2", "#20c997"];
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="card shadow-sm border-0 p-3">
      <h5 className="fw-bold text-primary mb-3 text-center">
        📊 Issue Status Distribution
      </h5>
      <div style={{ width: "100%", height: "280px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={900}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
              <Label
                value={`Total: ${total}`}
                position="center"
                className="fw-bold text-muted small"
              />
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}`, `${name}`]}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <Legend verticalAlign="bottom" iconType="circle" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
