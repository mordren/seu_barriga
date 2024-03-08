module.exports = function RecursoIndevidoError(message = 'Você não pode acessar essa página') {
    this.name = 'RecursoIndevidoError';
    this.message = message;
  };