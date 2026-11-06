
require __DIR__ . '/funcoes.php';
iniciarApi();

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $pontos = lerJson('pontos_risco.json');
    // Mais recentes primeiro.
    usort($pontos, fn($a, $b) => strcmp($b['data_hora'], $a['data_hora']));
    responder($pontos);
}

if ($metodo !== 'POST') {
    responder(['erro' => 'Método não permitido.'], 405);
}

$dados = json_decode(file_get_contents('php://input'), true);
if (!is_array($dados)) {
    responder(['erro' => 'Dados inválidos.'], 400);
}

$erros = validarPontoRisco($dados);
if ($erros) {
    responder(['erro' => $erros[0], 'erros' => $erros], 422);
}

// Confere se quem está registrando existe de verdade.
$usuarioId = (int) ($dados['usuario_id'] ?? 0);
$usuarioExiste = false;
foreach (lerJson('usuarios.json') as $u) {
    if ($u['id'] === $usuarioId) {
        $usuarioExiste = true;
        break;
    }
}
if (!$usuarioExiste) {
    responder(['erro' => 'Usuário não encontrado. Faça login novamente.'], 401);
}

$pontos = lerJson('pontos_risco.json');
$proximoId = $pontos ? max(array_column($pontos, 'id')) + 1 : 1;

$ponto = [
    'id'         => $proximoId,
    'tipo'       => $dados['tipo'],
    'local'      => texto($dados, 'local'),
    'descricao'  => texto($dados, 'descricao'),
    'nivel'      => $dados['nivel'],
    'status'     => 'Em análise',
    'usuario_id' => $usuarioId,
    'data_hora'  => date('Y-m-d H:i:s'),
];

$pontos[] = $ponto;
salvarJson('pontos_risco.json', $pontos);

responder([
    'mensagem' => 'Ponto de risco cadastrado com sucesso!',
    'ponto'    => $ponto,
], 201);