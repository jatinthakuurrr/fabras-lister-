const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'fabras_lister.db'));

db.pragma('journal_mode = WAL');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      contact_email TEXT,
      feed_url TEXT,
      is_authorized INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      source_id TEXT UNIQUE NOT NULL,
      supplier_id INTEGER,
      raw_title TEXT NOT NULL,
      ai_title TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      specifications TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      images TEXT NOT NULL,
      supplier_price REAL NOT NULL,
      selling_price REAL NOT NULL DEFAULT 499.00,
      currency TEXT NOT NULL DEFAULT 'INR',
      stock INTEGER NOT NULL DEFAULT 0,
      source_url TEXT,
      status TEXT CHECK(status IN ('READY', 'PUBLISHED', 'FAILED', 'REJECTED', 'DUPLICATE', 'OUT_OF_STOCK')) DEFAULT 'READY',
      storzu_product_id TEXT,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );

    CREATE TABLE IF NOT EXISTS sync_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      source TEXT NOT NULL,
      total_processed INTEGER DEFAULT 0,
      successful INTEGER DEFAULT 0,
      duplicates INTEGER DEFAULT 0,
      failed INTEGER DEFAULT 0,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const setStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  setStmt.run('daily_limit', '100');
  setStmt.run('sync_schedule_hour', '3');
  setStmt.run('auto_sync_enabled', '1');

  const supStmt = db.prepare('INSERT OR IGNORE INTO suppliers (id, name, feed_url, is_authorized) VALUES (?, ?, ?, ?)');
  supStmt.run(1, 'Fabras Global Authorized Horology Hub', 'https://authorized-feed.fabras.internal/watches.json', 1);
}

module.exports = { db, initDatabase };
