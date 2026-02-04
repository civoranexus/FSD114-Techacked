import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#E8F0FE";
const PENDING = "#A5B4FC"; // lighter blue

const Progress = () => {
  const progress = [
    {
      course: "Class 10 - Mathematics",
      completed: 3,
      total: 10,
      topics: [
        { name: "Algebra Basics", done: true },
        { name: "Polynomials", done: true },
        { name: "Linear Equations", done: false },
      ],
    },
    {
      course: "Class 10 - Science",
      completed: 1,
      total: 8,
      topics: [
        { name: "Chemical Reactions", done: true },
        { name: "Acids & Bases", done: false },
        { name: "Electricity", done: false },
      ],
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "auto" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        📘 Your Progress
      </h1>

      {progress.map((item, i) => {
        const chartData = [
          { name: "Completed", value: item.completed },
          { name: "Pending", value: item.total - item.completed },
        ];

        return (
          <div
            key={i}
            style={{
              padding: "20px",
              borderRadius: "14px",
              marginBottom: "30px",
              background: "white",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}>
              {item.course}
            </h2>
            <p style={{ color: "#6B7280", marginTop: "4px" }}>
              {item.completed} / {item.total} topics completed
            </p>

            {/* BLUE PROGRESS BAR */}
            <div
              style={{
                marginTop: "14px",
                height: "10px",
                background: "#E5E7EB",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(item.completed / item.total) * 100}%`,
                  height: "10px",
                  borderRadius: "10px",
                  background: BLUE,
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            {/* PIE CHART */}
            <div style={{ marginTop: "20px", height: "200px" }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    <Cell fill={BLUE} />
                    <Cell fill={PENDING} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <h3
              style={{
                marginTop: "20px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Topics Overview:
            </h3>

            {item.topics.map((t, idx) => (
              <div
                key={idx}
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: t.done ? BLUE_LIGHT : "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#111827" }}>{t.name}</span>
                <span
                  style={{
                    fontWeight: "600",
                    color: t.done ? BLUE : "#6B7280",
                  }}
                >
                  {t.done ? "✓ Completed" : "⏳ Pending"}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
