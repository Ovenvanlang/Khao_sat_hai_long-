// Ráp các lớp theo sơ đồ kiến trúc: routes → services → repositories → CSDL.
const path = require('node:path');
const express = require('express');
const { attachUser } = require('./middleware/access');
const { notFound, errorHandler } = require('./middleware/error-handler');
const { createTicketRepository } = require('./repositories/ticket.repository');
const { createSurveyRepository } = require('./repositories/survey.repository');
const { createSurveyService } = require('./services/survey.service');
const { createReportService } = require('./services/report.service');
const { createSurveyRoutes } = require('./routes/surveys.routes');
const { createReportRoutes } = require('./routes/reports.routes');

function createApp({ db, now } = {}) {
  const app = express();
  app.use(express.json({ limit: '10kb' }));

  const ticketRepo = createTicketRepository(db);
  const surveyRepo = createSurveyRepository(db);
  const surveyService = createSurveyService({ surveyRepo, ticketRepo, now });
  const reportService = createReportService();

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', attachUser);
  app.use('/api/surveys', createSurveyRoutes(surveyService));
  app.use('/api/reports', createReportRoutes(reportService));
  app.use(express.static(path.join(__dirname, '..', 'frontend')));   // Frontend: src/frontend (cùng cổng nên gọi API bằng đường dẫn tương đối, không cần CORS)

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
