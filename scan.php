<?php
require __DIR__ . '/vendor/autoload.php';

$spreadsheetId = 'SPREADSHEET_ID_KAMU'; // ganti dengan ID Spreadsheet
$range = 'Scanner!A2:E';
$client = new \Google_Client();
$client->setAuthConfig('creds.json');
$client->addScope(Google_Service_Sheets::SPREADSHEETS);

$service = new Google_Service_Sheets($client);
$response = $service->spreadsheets_values->get($spreadsheetId, $range);
$rows = $response->getValues();

$id = $_GET['id'] ?? null;
$found = null;
$rowIndex = 2;

foreach ($rows as $i => $row) {
    if (isset($row[2]) && $row[2] == $id) {
        $found = $row;
        $rowIndex += $i;
        break;
    }
}

// Update kondisi jika ada POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $id && isset($_POST['kondisi'])) {
    $newCondition = $_POST['kondisi'];
    $updateRange = "Scanner!D{$rowIndex}";
    $body = new Google_Service_Sheets_ValueRange([
        'values' => [[$newCondition]]
    ]);
    $params = ['valueInputOption' => 'RAW'];
    $service->spreadsheets_values->update($spreadsheetId, $updateRange, $body, $params);
    header("Location: scan.php?id=" . urlencode($id));
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Scan Barang</title>
  <link rel="icon" href="icon.png">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <a href="index.php" class="btn back">← Kembali</a>

    <h2>Detail Inventaris</h2>

    <?php if ($id && $found): ?>
      <div class="card">
        <p><strong>Nama:</strong> <?= htmlspecialchars($found[0]) ?></p>
        <p><strong>Lokasi:</strong> <?= htmlspecialchars($found[1]) ?></p>
        <p><strong>Kode:</strong> <?= htmlspecialchars($found[2]) ?></p>
        <form method="post">
          <label for="kondisi"><strong>Kondisi:</strong></label><br>
          <input type="text" name="kondisi" id="kondisi" value="<?= htmlspecialchars($found[3] ?? '') ?>" required>
          <button type="submit" class="btn">Simpan Perubahan</button>
        </form>
        <br>
        <img src="<?= htmlspecialchars($found[4] ?? '') ?>" alt="QR Code" width="150">
      </div>
    <?php elseif ($id): ?>
      <p>Data dengan kode <strong><?= htmlspecialchars($id) ?></strong> tidak ditemukan.</p>
    <?php else: ?>
      <p>Silakan scan QR code yang mengarah ke <code>scan.php?id=KODE</code></p>
    <?php endif; ?>
  </div>
</body>
</html>
