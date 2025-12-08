<?php
if (session_status() !== PHP_SESSION_ACTIVE) session_start();

function cart_init() {
  if (!isset($_SESSION['cart'])) $_SESSION['cart'] = []; // termek_id => qty
}
function cart_add(int $termek_id, int $qty = 1) {
  cart_init();
  $qty = max(1, (int)$qty);
  $_SESSION['cart'][$termek_id] = max(1, (int)($_SESSION['cart'][$termek_id] ?? 0) + $qty);
}
function cart_set(int $termek_id, int $qty) {
  cart_init();
  $qty = (int)$qty;
  if ($qty <= 0) { unset($_SESSION['cart'][$termek_id]); return; }
  // felső korlát, hogy ne lehessen véletlen 99999
  $_SESSION['cart'][$termek_id] = min($qty, 9999);
}
function cart_remove(int $termek_id) {
  cart_init(); unset($_SESSION['cart'][$termek_id]);
}
function cart_clear() { $_SESSION['cart'] = []; }

function cart_items(mysqli $db): array {
  cart_init();
  if (!$_SESSION['cart']) return [];
  $ids = array_map('intval', array_keys($_SESSION['cart']));
  $in  = implode(',', array_fill(0, count($ids), '?'));
  $types = str_repeat('i', count($ids));
  $sql = "SELECT id, nev, cikkszam, egysegar, kep_url FROM termekek WHERE id IN ($in)";
  $stmt = $db->prepare($sql);
  $stmt->bind_param($types, ...$ids);
  $stmt->execute();
  $res = $stmt->get_result();
  $rows = [];
  while ($r = $res->fetch_assoc()) {
    $qty = (int)($_SESSION['cart'][$r['id']] ?? 0);
    if ($qty <= 0) continue;
    $r['qty'] = $qty;
    $r['subtotal'] = (int)$r['egysegar'] * $qty;
    $rows[] = $r;
  }
  $stmt->close();
  usort($rows, fn($a,$b)=>$a['id']<=>$b['id']);
  return $rows;
}
function cart_total(mysqli $db): int {
  $items = cart_items($db);
  return array_sum(array_column($items, 'subtotal'));
}
function cart_count(): int {
  cart_init(); return array_sum($_SESSION['cart']);
}
