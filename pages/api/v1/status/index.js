function status(request, response) {
  response.status(200).json({ chave: "Status da página" });
}

export default status;
