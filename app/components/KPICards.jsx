// app/components/KPICards.jsx
export default function KPICards({ data }) {
  if (!data || !data.AllDetails) return null;

  const { totalCount, yearMax, yearMin, monthMax, monthMin } = data.AllDetails;

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-label">
          <i className="fas fa-database"></i> Total Events
        </div>
        <div className="kpi-value">{totalCount}</div>
        <div className="kpi-sub">across 4 years</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">
          <i className="fas fa-chart-line"></i> Peak Year
        </div>
        <div className="kpi-value">{yearMax?.year}</div>
        <div className="kpi-sub">{yearMax?.count} events</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">
          <i className="fas fa-calendar-week"></i> Busiest Month
        </div>
        <div className="kpi-value">{monthMax?.month}</div>
        <div className="kpi-sub">{monthMax?.count} events</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">
          <i className="fas fa-chart-simple"></i> Quietest Year
        </div>
        <div className="kpi-value">{yearMin?.year}</div>
        <div className="kpi-sub">{yearMin?.count} events</div>
      </div>
    </div>
  );
}