<?php

require __DIR__ . '/funcoes.php';
iniciarApi();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['erro' => 'Método não permitido.'], 405);
}

$dados = json_decode(file_get_contents('php://input'), true);
if (!is_array($dados)) {
    responder(['erro' => 'Dados inválidos.'], 400);
}

$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

if ($email === '' || $senha === '') {
    responder(['erro' => 'Informe e-mail e senha.'], 422);
}

foreach (lerJson('usuarios.json') as $u) {
    if ($u['email'] === $email && password_verify($senha, $u['senha_hash'])) {
        responder([
            'mensagem' => 'Login realizado com sucesso!',
            'usuario'  => [
                'id'    => $u['id'],
                'nome'  => $u['nome'],
                'email' => $u['email'],
            ],
        ]);
    }
}

responder(['erro' => 'E-mail ou senha incorretos.'], 401);