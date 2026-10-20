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

$erros = validarCadastro($dados);
if ($erros) {
    responder(['erro' => $erros[0], 'erros' => $erros], 422);
}

$email = strtolower(trim($dados['email']));
$cpf = somenteNumeros($dados['cpf']);

$usuarios = lerJson('usuarios.json');

foreach ($usuarios as $u) {
    if ($u['email'] === $email) {
        responder(['erro' => 'Este e-mail já está cadastrado.'], 409);
    }
    if ($u['cpf'] === $cpf) {
        responder(['erro' => 'Este CPF já está cadastrado.'], 409);
    }
}

$usuarios[] = [
    'id'         => count($usuarios) + 1,
    'nome'       => trim($dados['nome']),
    'email'      => $email,
    'cpf'        => $cpf,
    'telefone'   => somenteNumeros($dados['telefone']),
    'senha_hash' => password_hash($dados['senha'], PASSWORD_DEFAULT),
    'criado_em'  => date('Y-m-d H:i:s'),
];

salvarJson('usuarios.json', $usuarios);

responder(['mensagem' => 'Cadastro realizado com sucesso!'], 201);