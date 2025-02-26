import './LoadingSpinner.css';

function Spin() {
  return (
    <div className="spinner-container">
      <div className="spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spin;