import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import thermalPrinterService from '../../services/thermalPrinterService';
import { toast } from 'react-toastify';

export const PrinterSettings: React.FC = () => {
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [paperWidth, setPaperWidth] = useState<58 | 80>(80);
  const [loading, setLoading] = useState(false);
  const [qzConnected, setQzConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    loadSavedSettings();
  }, []);

  const checkConnection = async () => {
    const connected = await thermalPrinterService.initialize();
    setQzConnected(connected);

    if (connected) {
      await loadPrinters();
    }
  };

  const loadPrinters = async () => {
    try {
      setLoading(true);
      const printerList = await thermalPrinterService.getPrinters();
      setPrinters(printerList);
    } catch (error) {
      console.error('Failed to load printers:', error);
      toast.error('Failed to load printers');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSettings = () => {
    const savedPrinter = localStorage.getItem('thermal_printer_name');
    const savedWidth = localStorage.getItem('thermal_paper_width');

    if (savedPrinter) {
      setSelectedPrinter(savedPrinter);
    }
    if (savedWidth) {
      setPaperWidth(parseInt(savedWidth) as 58 | 80);
    }
  };

  const handleSaveSettings = () => {
    // Save to local storage
    if (selectedPrinter) {
      localStorage.setItem('thermal_printer_name', selectedPrinter);
    }
    localStorage.setItem('thermal_paper_width', paperWidth.toString());

    // Update service configuration
    thermalPrinterService.setConfig({
      printerName: selectedPrinter,
      paperWidth: paperWidth
    });

    toast.success('Printer settings saved successfully');
  };

  const handleTestPrint = async () => {
    try {
      setLoading(true);

      // Create a test order
      const testOrder = {
        id: 'test-' + Date.now(),
        orderNumber: 'TEST-001',
        orderDate: new Date().toISOString(),
        customerName: 'Test Customer',
        cashierName: 'Test Cashier',
        orderItems: [
          {
            productId: '1',
            productName: 'Test Product 1',
            quantity: 2,
            unitPrice: 100,
            discount: 0,
            subtotal: 200,
            taxAmount: 0,
            total: 200
          },
          {
            productId: '2',
            productName: 'Test Product 2',
            quantity: 1,
            unitPrice: 150,
            discount: 10,
            subtotal: 140,
            taxAmount: 0,
            total: 140
          }
        ],
        subtotalAmount: 340,
        discountAmount: 10,
        taxAmount: 0,
        totalAmount: 340,
        paymentMethod: 'Cash',
        cashAmount: 500,
        changeAmount: 160,
        status: 'Completed',
        notes: 'This is a test receipt'
      };

      await thermalPrinterService.printReceipt(testOrder, {
        printerName: selectedPrinter,
        paperWidth: paperWidth
      });

      toast.success('Test receipt printed successfully!');
    } catch (error) {
      console.error('Test print failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to print test receipt';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">
        <i className="bi bi-printer me-2 text-primary"></i>
        Thermal Printer Settings
      </h2>

      {!qzConnected ? (
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>QZ Tray Not Connected</strong>
          <p className="mb-2 mt-2">
            To use thermal printing, you need to install and run QZ Tray:
          </p>
          <ol className="mb-2">
            <li>Download QZ Tray from <a href="https://qz.io/download/" target="_blank" rel="noopener noreferrer">https://qz.io/download/</a></li>
            <li>Install and start the QZ Tray application</li>
            <li>Refresh this page or click the button below</li>
          </ol>
          <Button variant="primary" size="sm" onClick={checkConnection}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Check Connection
          </Button>
        </Alert>
      ) : (
        <>
          <Alert variant="success">
            <i className="bi bi-check-circle me-2"></i>
            QZ Tray is connected and ready
          </Alert>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Printer Configuration</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Printer</Form.Label>
                  <Form.Select
                    value={selectedPrinter}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                  >
                    <option value="">Auto-detect (use first available)</option>
                    {printers.map((printer) => (
                      <option key={printer} value={printer}>
                        {printer}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Select your thermal printer from the list
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Paper Width</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="58mm (2 inch)"
                      name="paperWidth"
                      checked={paperWidth === 58}
                      onChange={() => setPaperWidth(58)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="80mm (3 inch)"
                      name="paperWidth"
                      checked={paperWidth === 80}
                      onChange={() => setPaperWidth(80)}
                    />
                  </div>
                  <Form.Text className="text-muted">
                    Select the paper width of your thermal printer
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSaveSettings}
                    disabled={loading}
                  >
                    <i className="bi bi-save me-2"></i>
                    Save Settings
                  </Button>

                  <Button
                    variant="outline-primary"
                    onClick={handleTestPrint}
                    disabled={loading || !selectedPrinter && printers.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Printing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-printer me-2"></i>
                        Test Print
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    onClick={loadPrinters}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh Printers
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Available Printers ({printers.length})</h5>
            </Card.Header>
            <Card.Body>
              {printers.length === 0 ? (
                <p className="text-muted mb-0">No printers found</p>
              ) : (
                <ListGroup>
                  {printers.map((printer, index) => (
                    <ListGroup.Item key={index}>
                      <i className="bi bi-printer me-2"></i>
                      {printer}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </>
      )}

      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Troubleshooting</h5>
        </Card.Header>
        <Card.Body>
          <h6>Common Issues:</h6>
          <ul>
            <li>
              <strong>QZ Tray not connecting:</strong> Make sure QZ Tray application is running in your system tray
            </li>
            <li>
              <strong>No printers found:</strong> Check that your thermal printer is connected and powered on
            </li>
            <li>
              <strong>Print not working:</strong> Verify the printer is set as default or select it manually from the list
            </li>
            <li>
              <strong>Incorrect formatting:</strong> Make sure the paper width setting matches your printer
            </li>
          </ul>

          <h6 className="mt-3">Supported Printers:</h6>
          <p className="mb-0">
            Any ESC/POS compatible thermal printer should work, including:
            <br />
            EPSON, Star Micronics, Zebra, Bixolon, Citizen, and most generic thermal printers.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PrinterSettings;
