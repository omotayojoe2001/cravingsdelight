import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://ootzekjdfcejtwssfwpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vdHpla2pkZmNlanR3c3Nmd3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTEzMTIsImV4cCI6MjA4MDg2NzMxMn0.Lx3RUI8wzrFbN1rcOoahTzPcAQQ7qAabOKjF-o5TgEE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up invoice system database...');
    
    const sqlFile = fs.readFileSync('./database/setup_invoice_system.sql', 'utf8');
    
    // Split SQL commands by semicolon and execute each one
    const commands = sqlFile.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (const command of commands) {
      if (command.trim()) {
        console.log('Executing:', command.substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: command.trim() + ';' });
        if (error) {
          console.error('Error executing command:', error);
        }
      }
    }
    
    console.log('Database setup completed!');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();