<?php

require __DIR__ . '/funcoes.php';
iniciarApi();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responder(['erro' => 'Método não permitido.'], 405);
}

$alertas = lerJson('alertas.json');

$nivel = $_GET['nivel'] ?? '';
if ($nivel !== '' && $nivel !== 'Todos') {
    $alertas = array_values(array_filter(
        $alertas,
        fn($a) => $a['nivel'] === $nivel
    ));
}

// Mais recentes primeiro.
usort($alertas, fn($a, $b) => strcmp($b['data_hora'], $a['data_hora']));

responder($alertas);