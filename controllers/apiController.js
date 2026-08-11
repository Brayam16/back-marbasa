function status(req, res) {
  res.json({ status: 'ok', message: 'Backend Node.js de Marbasa funcionando', uptime: process.uptime() });
}

function echo(req, res) {
  res.json({ received: req.body });
}

module.exports = {
  status,
  echo
};
