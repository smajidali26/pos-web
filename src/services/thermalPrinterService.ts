/**
 * Thermal Printer Service
 *
 * This service provides thermal printing capabilities using QZ Tray.
 * QZ Tray is a free, open-source solution that bridges web applications with thermal printers.
 *
 * Installation Instructions:
 * 1. Download and install QZ Tray from https://qz.io/download/
 * 2. Start QZ Tray application (it runs in system tray)
 * 3. The service will automatically connect when available
 *
 * Supported Printers:
 * - ESC/POS compatible thermal printers (58mm, 80mm)
 * - USB, Serial, Network thermal printers
 * - Most common brands: EPSON, Star Micronics, Zebra, etc.
 */

import { Order } from './ordersService';
import { formatCurrency } from '../utils/currency';

// QZ Tray types
interface QZWebSocket {
  isActive: () => boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

interface QZPrinters {
  find: () => Promise<string[]>;
}

interface QZConfigs {
  create: (printerName: string, options: { encoding: string }) => unknown;
}

interface QZ {
  websocket: QZWebSocket;
  printers: QZPrinters;
  configs: QZConfigs;
  print: (config: unknown, commands: string[]) => Promise<void>;
}

// QZ Tray WebSocket connection
declare global {
  interface Window {
    qz?: QZ;
  }
}

interface PrinterConfig {
  printerName: string;
  paperWidth: 58 | 80; // mm
  encoding: string;
}

class ThermalPrinterService {
  private qz: QZ | null = null;
  private isConnected: boolean = false;
  private defaultConfig: PrinterConfig = {
    printerName: '', // Auto-detect or set specific printer name
    paperWidth: 80,
    encoding: 'UTF-8'
  };

  /**
   * Initialize QZ Tray connection
   */
  async initialize(): Promise<boolean> {
    try {
      // Load QZ Tray script if not already loaded
      if (!window.qz) {
        await this.loadQZTrayScript();
      }

      this.qz = window.qz;

      if (!this.qz.websocket.isActive()) {
        await this.qz.websocket.connect();
      }

      this.isConnected = true;
      console.log('QZ Tray connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect to QZ Tray:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Load QZ Tray JavaScript library
   */
  private loadQZTrayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.qz) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qz-tray@2.2/qz-tray.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load QZ Tray library'));
      document.head.appendChild(script);
    });
  }

  /**
   * Check if QZ Tray is connected
   */
  isQZConnected(): boolean {
    return this.isConnected && this.qz && this.qz.websocket.isActive();
  }

  /**
   * Get list of available printers
   */
  async getPrinters(): Promise<string[]> {
    try {
      if (!this.isQZConnected()) {
        await this.initialize();
      }

      const printers = await this.qz.printers.find();
      return printers;
    } catch (error) {
      console.error('Failed to get printers:', error);
      return [];
    }
  }

  /**
   * Set printer configuration
   */
  setConfig(config: Partial<PrinterConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Print receipt to thermal printer
   */
  async printReceipt(order: Order, config?: Partial<PrinterConfig>): Promise<void> {
    try {
      if (!this.isQZConnected()) {
        const connected = await this.initialize();
        if (!connected) {
          throw new Error('QZ Tray is not installed or not running. Please install QZ Tray from https://qz.io/download/');
        }
      }

      const printerConfig = { ...this.defaultConfig, ...config };

      // Get printer name
      let printerName = printerConfig.printerName;
      if (!printerName) {
        const printers = await this.getPrinters();
        if (printers.length === 0) {
          throw new Error('No printers found');
        }
        printerName = printers[0]; // Use first available printer
      }

      // Generate ESC/POS commands
      const commands = this.generateESCPOSCommands(order, printerConfig);

      // Configure print job
      const qzConfig = this.qz.configs.create(printerName, {
        encoding: printerConfig.encoding
      });

      // Print
      await this.qz.print(qzConfig, commands);
      console.log('Receipt printed successfully');
    } catch (error) {
      const err = error as Error;
      console.error('Print failed:', error);
      throw new Error(err.message || 'Failed to print receipt');
    }
  }

  /**
   * Generate ESC/POS commands for receipt
   */
  private generateESCPOSCommands(order: Order, config: PrinterConfig): string[] {
    const ESC = '\x1B';
    const GS = '\x1D';
    const commands: string[] = [];

    // Initialize printer
    commands.push(ESC + '@'); // Initialize

    // Store header - centered, bold, large
    commands.push(ESC + 'a' + '\x01'); // Center align
    commands.push(ESC + '!' + '\x30'); // Double height and width
    commands.push('POSWeb Store\n');
    commands.push(ESC + '!' + '\x00'); // Normal text
    commands.push('123 Main Street\n');
    commands.push('City, State 12345\n');
    commands.push('Tel: (555) 123-4567\n');
    commands.push(this.printLine(config.paperWidth));

    // Order information - left align
    commands.push(ESC + 'a' + '\x00'); // Left align
    commands.push(ESC + '!' + '\x08'); // Bold
    commands.push(`Order #: ${order.orderNumber}\n`);
    commands.push(ESC + '!' + '\x00'); // Normal
    commands.push(`Date: ${this.formatDate(order.orderDate)}\n`);

    if (order.customerName) {
      commands.push(`Customer: ${order.customerName}\n`);
    }
    if (order.cashierName) {
      commands.push(`Cashier: ${order.cashierName}\n`);
    }

    commands.push(this.printLine(config.paperWidth));

    // Items header
    commands.push(ESC + '!' + '\x08'); // Bold
    if (config.paperWidth === 80) {
      commands.push(this.formatLine('Item', 'Qty', 'Price', 'Total', config.paperWidth));
    } else {
      commands.push('Item                Qty  Total\n');
    }
    commands.push(ESC + '!' + '\x00'); // Normal
    commands.push(this.printLine(config.paperWidth));

    // Items
    order.orderItems.forEach(item => {
      const itemName = this.truncate(item.productName, config.paperWidth === 80 ? 20 : 15);
      const qty = item.quantity.toString();
      const price = formatCurrency(item.unitPrice);
      const total = formatCurrency(item.total);

      if (config.paperWidth === 80) {
        commands.push(this.formatLine(itemName, qty, price, total, config.paperWidth));
      } else {
        // Simplified for 58mm
        commands.push(`${this.padRight(itemName, 20)} ${this.padLeft(qty, 3)} ${this.padLeft(total, 9)}\n`);
      }

      // Show discount if any
      if (item.discount > 0) {
        commands.push(`  Discount: -${formatCurrency(item.discount)}\n`);
      }
    });

    commands.push(this.printLine(config.paperWidth));

    // Totals
    commands.push(this.formatTotal('Subtotal:', formatCurrency(order.subtotalAmount), config.paperWidth));

    if (order.discountAmount > 0) {
      commands.push(this.formatTotal('Discount:', `-${formatCurrency(order.discountAmount)}`, config.paperWidth));
    }

    if (order.taxAmount > 0) {
      commands.push(this.formatTotal('Tax:', formatCurrency(order.taxAmount), config.paperWidth));
    }

    commands.push(this.printLine(config.paperWidth));

    // Grand total - bold, large
    commands.push(ESC + '!' + '\x18'); // Bold + double height
    commands.push(this.formatTotal('TOTAL:', formatCurrency(order.totalAmount), config.paperWidth));
    commands.push(ESC + '!' + '\x00'); // Normal

    commands.push(this.printLine(config.paperWidth));

    // Payment info
    commands.push(`Payment: ${order.paymentMethod}\n`);

    if (order.cashAmount) {
      commands.push(this.formatTotal('Cash Paid:', formatCurrency(order.cashAmount), config.paperWidth));
    }

    if (order.changeAmount && order.changeAmount > 0) {
      commands.push(this.formatTotal('Change:', formatCurrency(order.changeAmount), config.paperWidth));
    }

    commands.push(this.printLine(config.paperWidth));

    // Footer - centered
    commands.push(ESC + 'a' + '\x01'); // Center align
    commands.push('\nThank you for your business!\n');
    commands.push('Please keep this receipt\n');
    commands.push('for your records.\n\n');

    // Notes if any
    if (order.notes) {
      commands.push(ESC + 'a' + '\x00'); // Left align
      commands.push(`Notes: ${order.notes}\n`);
    }

    // Cut paper
    commands.push('\n\n\n');
    commands.push(GS + 'V' + '\x41' + '\x03'); // Partial cut

    return commands;
  }

  /**
   * Format a line with multiple columns
   */
  private formatLine(col1: string, col2: string, col3: string, col4: string, paperWidth: number): string {
    if (paperWidth === 80) {
      // 48 characters total for 80mm
      return `${this.padRight(col1, 20)} ${this.padLeft(col2, 3)} ${this.padLeft(col3, 10)} ${this.padLeft(col4, 10)}\n`;
    } else {
      // 32 characters total for 58mm
      return `${this.padRight(col1, 15)} ${this.padLeft(col2, 3)} ${this.padLeft(col4, 10)}\n`;
    }
  }

  /**
   * Format total line
   */
  private formatTotal(label: string, value: string, paperWidth: number): string {
    const width = paperWidth === 80 ? 48 : 32;
    const spaces = width - label.length - value.length;
    return label + ' '.repeat(Math.max(spaces, 1)) + value + '\n';
  }

  /**
   * Print dashed line
   */
  private printLine(paperWidth: number): string {
    const width = paperWidth === 80 ? 48 : 32;
    return '-'.repeat(width) + '\n';
  }

  /**
   * Pad string to the right
   */
  private padRight(str: string, length: number): string {
    return str.length >= length ? str.substring(0, length) : str + ' '.repeat(length - str.length);
  }

  /**
   * Pad string to the left
   */
  private padLeft(str: string, length: number): string {
    return str.length >= length ? str.substring(0, length) : ' '.repeat(length - str.length) + str;
  }

  /**
   * Truncate string
   */
  private truncate(str: string, maxLength: number): string {
    return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
  }

  /**
   * Format date for receipt
   */
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Disconnect from QZ Tray
   */
  async disconnect(): Promise<void> {
    try {
      if (this.qz && this.qz.websocket.isActive()) {
        await this.qz.websocket.disconnect();
      }
      this.isConnected = false;
    } catch (error) {
      console.error('Failed to disconnect from QZ Tray:', error);
    }
  }
}

// Export singleton instance
export const thermalPrinterService = new ThermalPrinterService();
export default thermalPrinterService;
