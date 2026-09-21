function LoadingErrorState({ loading, error }) {
  if (loading) {
    return <div style={{ padding: '1rem', color: '#00d2d3' }}>Cargando datos del reino...</div>;
  }
  if (error) {
    return <div style={{ padding: '1rem', color: '#ff6b6b' }}>Error al conectar con la API: {error}</div>;
  }
  return null;
}

export default LoadingErrorState;