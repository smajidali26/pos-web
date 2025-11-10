import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import { Order, PaymentMethod } from '../../services/ordersService';
import { formatCurrency } from '../../utils/currency';
import thermalPrinterService from '../../services/thermalPrinterService';
import { toast } from 'react-toastify';

interface OrderReceiptProps {
  show: boolean;
  onClose: () => void;
  order: Order;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({
  show,
  onClose,
  order,
  storeName = 'POSWeb Store',
  storeAddress = '123 Main Street, City, State 12345',
  storePhone = '(555) 123-4567'
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isThermalPrinterAvailable, setIsThermalPrinterAvailable] = useState(false);
  const [thermalPrinting, setThermalPrinting] = useState(false);

  // Check thermal printer availability on mount
  useEffect(() => {
    const checkThermalPrinter = async () => {
      const isAvailable = await thermalPrinterService.initialize();
      setIsThermalPrinterAvailable(isAvailable);
    };

    if (show) {
      checkThermalPrinter();
    }
  }, [show]);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - {formatCurrency(order.orderNumber}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              margin: 20px;
            }
            .receipt {
              max-width: 300px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .store-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .order-info {
              margin: 10px 0;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .items {
              margin: 10px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .totals {
              border-top: 2px dashed #000;
              padding-top: 10px;
              margin-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .grand-total {
              font-size: 16px;
              font-weight: bold;
              border-top: 2px solid #000;
              margin-top: 5px;
              padding-top: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              border-top: 2px dashed #000;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          {formatCurrency(printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleThermalPrint = async () => {
    try {
      setThermalPrinting(true);
      await thermalPrinterService.printReceipt(order);
      toast.success('Receipt sent to thermal printer successfully!');
    } catch (error: any) {
      console.error('Thermal print error:', error);
      toast.error(error.message || 'Failed to print to thermal printer');
    } finally {
      setThermalPrinting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-receipt me-2"></i>
          Order Receipt
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isThermalPrinterAvailable && (
          <Alert variant="warning" className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Thermal Printer Not Available</strong>
            <p className="mb-0 mt-1 small">
              QZ Tray is not installed or not running. To enable thermal printing:
              <br />
              1. Download and install QZ Tray from <a href="https://qz.io/download/" target="_blank" rel="noopener noreferrer">https://qz.io/download/</a>
              <br />
              2. Start the QZ Tray application
              <br />
              3. Refresh this page
            </p>
          </Alert>
        )}

        <div ref={receiptRef} className="receipt-content">
          {/* Store Header */}
          <div className="text-center mb-4 pb-3 border-bottom">
            <h4 className="mb-1">{storeName}</h4>
            <div className="text-muted small">
              <div>{storeAddress}</div>
              <div>{storePhone}</div>
            </div>
          </div>

          {/* Order Information */}
          <div className="mb-4 pb-3 border-bottom">
            <div className="row">
              <div className="col-6">
                <strong>Order #:</strong> {order.orderNumber}
              </div>
              <div className="col-6 text-end">
                <strong>Date:</strong> {formatDate(order.orderDate)}
              </div>
            </div>
            {order.customerName && (
              <div className="mt-2">
                <strong>Customer:</strong> {order.customerName}
              </div>
            )}
            {order.cashierName && (
              <div>
                <strong>Cashier:</strong> {order.cashierName}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h6 className="mb-3">Items</h6>
            <Table size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div>{item.productName}</div>
                      {item.categoryName && (
                        <small className="text-muted">{item.categoryName}</small>
                      )}
                      {item.discount > 0 && (
                        <small className="text-success d-block">
                          Discount: -{formatCurrency(item.discount)}
                        </small>
                      )}
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-end">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Totals */}
          <div className="border-top pt-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <strong>{formatCurrency(order.subtotalAmount)}</strong>
            </div>

            {order.discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount:</span>
                <strong>-{formatCurrency(order.discountAmount)}</strong>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span>Tax:</span>
              <strong>{formatCurrency(order.taxAmount)}</strong>
            </div>

            <div className="d-flex justify-content-between mb-3 py-2 border-top border-bottom">
              <span className="h5 mb-0">Total:</span>
              <span className="h5 mb-0">{formatCurrency(order.totalAmount)}</span>
            </div>

            {/* Payment Information */}
            <div className="mb-2">
              <div className="d-flex justify-content-between">
                <span>Payment Method:</span>
                <strong>
                  {order.paymentMethod === PaymentMethod.Cash && (
                    <>
                      <i className="bi bi-cash me-1"></i>
                      Cash
                    </>
                  )}
                  {order.paymentMethod === PaymentMethod.Card && (
                    <>
                      <i className="bi bi-credit-card me-1"></i>
                      Card
                    </>
                  )}
                  {order.paymentMethod === PaymentMethod.Mixed && (
                    <>
                      <i className="bi bi-wallet2 me-1"></i>
                      Mixed
                    </>
                  )}
                </strong>
              </div>
            </div>

            {order.paymentMethod === PaymentMethod.Cash && order.cashAmount && (
              <>
                <div className="d-flex justify-content-between">
                  <span>Cash Received:</span>
                  <strong>{formatCurrency(order.cashAmount)}</strong>
                </div>
                {order.changeAmount && order.changeAmount > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <span>Change:</span>
                    <strong>{formatCurrency(order.changeAmount)}</strong>
                  </div>
                )}
              </>
            )}

            {order.paymentMethod === PaymentMethod.Mixed && (
              <>
                {order.cashAmount && order.cashAmount > 0 && (
                  <div className="d-flex justify-content-between">
                    <span>Cash:</span>
                    <strong>{formatCurrency(order.cashAmount)}</strong>
                  </div>
                )}
                {order.cardAmount && order.cardAmount > 0 && (
                  <div className="d-flex justify-content-between">
                    <span>Card:</span>
                    <strong>{formatCurrency(order.cardAmount)}</strong>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-3 p-2 bg-light rounded">
              <small>
                <strong>Notes:</strong> {order.notes}
              </small>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-top">
            <p className="mb-1">Thank you for your business!</p>
            <small className="text-muted">
              Please keep this receipt for your records.
            </small>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="no-print">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {isThermalPrinterAvailable && (
          <Button
            variant="success"
            onClick={handleThermalPrint}
            disabled={thermalPrinting}
          >
            {thermalPrinting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Printing to Thermal...
              </>
            ) : (
              <>
                <i className="bi bi-printer-fill me-2"></i>
                Print to Thermal Printer
              </>
            )}
          </Button>
        )}
        <Button variant="primary" onClick={handlePrint}>
          <i className="bi bi-printer me-2"></i>
          Print Receipt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderReceipt;
