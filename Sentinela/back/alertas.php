<?php

require __DIR__ . '/funcoes.php';
iniciarApi();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responder(['erro' => 'Método não permitido.'], 405);
}

$lista = [];

foreach (lerJson('alertas.json') as $a) {
    $a['id'] = 'alerta-' . $a['id'];
    $a['origem'] = 'alerta';
    $lista[] = $a;
}

foreach (lerJson('pontos_risco.json') as $p) {
    $lista[] = [
        'id'        => 'ponto-' . $p['id'],
        'tipo'      => $p['tipo'],
        'nivel'     => $p['nivel'],
        'local'     => $p['local'],
        'descricao' => $p['descricao'],
        'status'    => $p['status'],
        'data_hora' => $p['data_hora'],
        'origem'    => 'ponto de risco',
    ];
}

$nivel = $_GET['nivel'] ?? '';
if ($nivel !== '' && $nivel !== 'Todos') {
    $lista = array_values(array_filter($lista, fn($a) => $a['nivel'] === $nivel));
}

usort($lista, fn($a, $b) => strcmp($b['data_hora'], $a['data_hora']));

responder($lista);