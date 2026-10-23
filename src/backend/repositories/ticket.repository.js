// Lớp repository: CHỈ chứa SQL. Không chứa quy tắc nghiệp vụ.
function createTicketRepository(db) {
  const byId = db.prepare(
    'SELECT ticket_id, ticket_code, center_id, technician_id, status FROM ticket WHERE ticket_id = ?');
  return {
    findById: (ticketId) => byId.get(ticketId),
  };
}

module.exports = { createTicketRepository };
