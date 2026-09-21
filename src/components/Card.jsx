function Card({ option, onSelect }) {
  return (
    <button
      onClick={() => onSelect(option)}
      style={{
        display: 'block',
        width: '100%',
        padding: '0.8rem',
        margin: '0.5rem 0',
        backgroundColor: '#0f3460',
        color: '#fff',
        border: '1px solid #e94560',
        borderRadius: '6px',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      {option.text}
    </button>
  );
}

export default Card;