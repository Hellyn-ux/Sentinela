<?php

require __DIR__ . '/funcoes.php';
require __DIR__ . '/conexao.php';
iniciarApi();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['erro' => 'Método não permitido.'], 405);
}

$dados = json_decode(file_get_contents('php://input'), true);
if (!is_array($dados)) {
    responder(['erro' => 'Dados inválidos.'], 400);
}

$erros = validarCadastro($dados);
if ($erros) {
    responder(['erro' => $erros[0], 'erros' => $erros], 422);
}

$email = strtolower(trim($dados['email']));
$cpf = somenteNumeros($dados['cpf']);

try {
    // Verifica duplicados no banco
    $stmt = $pdo->prepare('SELECT email, cpf FROM usuarios WHERE email = ? OR cpf = ?');
    $stmt->execute([$email, $cpf]);
    $existente = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existente) {
        if ($existente['email'] === $email) {
            responder(['erro' => 'Este e-mail já está cadastrado.'], 409);
        }
        responder(['erro' => 'Este CPF já está cadastrado.'], 409);
    }

    // Insere o novo usuário
    $stmt = $pdo->prepare(
        'INSERT INTO usuarios (nome, email, cpf, telefone, senha_hash) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        trim($dados['nome']),
        $email,
        $cpf,
        somenteNumeros($dados['telefone']),
        password_hash($dados['senha'], PASSWORD_DEFAULT),
    ]);
} catch (PDOException $e) {
    responder(['erro' => 'Erro ao salvar no banco.'], 500);
}

responder(['mensagem' => 'Cadastro realizado com sucesso!'], 201);