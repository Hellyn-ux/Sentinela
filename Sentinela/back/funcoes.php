<?php

const PASTA_DADOS = __DIR__ . '/data/';


function iniciarApi(): void
{
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function responder(array $dados, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}


function lerJson(string $arquivo): array
{
    $caminho = PASTA_DADOS . $arquivo;
    if (!file_exists($caminho)) {
        return [];
    }
    $dados = json_decode(file_get_contents($caminho), true);
    return is_array($dados) ? $dados : [];
}

function salvarJson(string $arquivo, array $dados): void
{
    if (!is_dir(PASTA_DADOS)) {
        mkdir(PASTA_DADOS, 0777, true);
    }
    file_put_contents(
        PASTA_DADOS . $arquivo,
        json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}


function somenteNumeros(string $texto): string
{
    return preg_replace('/\D/', '', $texto);
}

function validarCpf(string $cpf): bool
{
    $cpf = somenteNumeros($cpf);

    if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
        return false;
    }

    for ($t = 9; $t < 11; $t++) {
        $soma = 0;
        for ($i = 0; $i < $t; $i++) {
            $soma += $cpf[$i] * (($t + 1) - $i);
        }
        $digito = ((10 * $soma) % 11) % 10;
        if ($cpf[$t] != $digito) {
            return false;
        }
    }
    return true;
}

function validarTelefone(string $telefone): bool
{
    $tamanho = strlen(somenteNumeros($telefone));
    return $tamanho === 10 || $tamanho === 11;
}

function validarCadastro(array $d): array
{
    $erros = [];

   if (strlen(trim($d['nome'] ?? '')) < 3) {
    }
    if (!filter_var($d['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
        $erros[] = 'E-mail inválido.';
    }
    if (!validarCpf($d['cpf'] ?? '')) {
        $erros[] = 'CPF inválido.';
    }
    if (!validarTelefone($d['telefone'] ?? '')) {
        $erros[] = 'Telefone inválido. Use DDD + número.';
    }
    if (strlen($d['senha'] ?? '') < 8) {
        $erros[] = 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (empty($d['termos'])) {
        $erros[] = 'Você precisa aceitar os termos de uso.';
    }

    return $erros;
}