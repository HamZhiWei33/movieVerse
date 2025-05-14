// components/CustomLegend.jsx
const CustomLegend = ({ payload, isMobile }) => {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: isMobile ? "10px 0" : "0 10px",
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        flexWrap: "wrap",
        justifyContent: isMobile ? "center" : "flex-start",
      }}
    >
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            margin: "4px 10px",
            color: "white",
            fontWeight: "regular",
            fontSize: isMobile ? 12 : 16,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: entry.color,
              marginRight: 8,
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
