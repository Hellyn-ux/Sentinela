<?php

require __DIR__ . '/funcoes.php';
iniciarApi();
require __DIR__ . '/conexao.php';

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

try {
    $stmt = $pdo->prepare('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    responder(['erro' => 'Erro ao consultar o banco.'], 500);
}

if ($u && password_verify($senha, $u['senha_hash'])) {
    responder([
        'mensagem' => 'Login realizado com sucesso!',
        'usuario'  => [
            'id'    => (int) $u['id'],
            'nome'  => $u['nome'],
            'email' => $u['email'],
        ],
    ]);
}

responder(['erro' => 'E-mail ou senha incorretos.'], 401);