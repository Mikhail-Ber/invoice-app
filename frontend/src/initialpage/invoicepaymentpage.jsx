import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Applogo } from "../Entryfile/imagepath";
import { jwtService } from "../services";
import {
  ProductTableBody,
} from "../components";
import { makeFixed2 } from "../helpers/UtiFunctions";
import StripeModal from "../components/InvoiceView/StripeModal";

const getProductPrice = (product) => {
  const { price, quantity } = product;
  return makeFixed2(price * quantity);
};

const InvoicePayment = () => {
  /** Get Invoice ID from the URL params **/
  const orgId = useParams().invoiceId;

  /** Fetch Invoice Details From Backend with invoiceId **/
  useEffect(() => {
    jwtService
      .getInvoiceFromInvoiceId(orgId)
      .then((response) => {
        setFieldsData(response.data);
      })
      .catch((error) => console.log("error", error));
  }, [setFieldsData]);

  /** invoice details state **/
  const [invoiceId, setInvoiceId] = useState(null);
  const [sClient, setSClient] = useState(null); // client
  const [billfor, setBillFor] = useState(""); // bill
  const [tax, setTax] = useState(5); // tax
  const [invoiceProducts, setIProducts] = useState([]); // product list of invoice

  //get total price of invoice including tax
  //returns { totalPrice, taxPrice, sum }
  const getTotalPrice = useMemo(() => {
    if (!invoiceProducts || !invoiceProducts.length)
      return {
        totalPrice: 0.0,
        taxPrice: 0.0,
      };

    const totalPrice = invoiceProducts.reduce(
      (total, product) => Number(total) + Number(getProductPrice(product)),
      0
    );
    const taxPrice = tax && totalPrice ? (totalPrice * tax) / 100 : 0.0;
    const sum = totalPrice && taxPrice ? totalPrice + taxPrice : 0.0;

    return {
      totalPrice: makeFixed2(totalPrice),
      taxPrice: makeFixed2(taxPrice),
      sum: makeFixed2(sum),
    };
  }, [invoiceProducts, tax]);

  const setFieldsData = useCallback((data) => {
    setInvoiceId(data.id);
    setBillFor(data.billfor);
    setSClient(data.client);
    setIProducts(
      data.products.map((p) => ({
        ...p,
        ...p.product,
      }))
    );
    setTax(data.tax);
  }, []);

  const showCardPayForm = useCallback(() => {
    setStripeCardModalOpen(true);
  }, []);

  const [stripeCardModalIsOpen, setStripeCardModalOpen] = useState(false);

  return (
    <div className="page-wrapper page-payment-wrapper invoice-view">
      <Helmet>
        <title>{`Invoice ${invoiceId} Detail`}</title>
        <meta name="description" content="Invoice Detail Page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-8 m-b-20">
                    <div className="invoice-details">
                      <h3 className="text-uppercase">
                        Invoice #INV-{invoiceId}
                      </h3>
                    </div>
                    <div className="vendor-logo">
                      <img src={Applogo} alt="vendor logo" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 col-lg-8 col-xl-8 m-b-20">
                    <span className="text-muted">Bill for</span>
                    <input
                      type="text"
                      className="bill-for"
                      value={billfor}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-hover invoice-table">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th className="d-none d-sm-table-cell">DESCRIPTION</th>
                        <th>PRICE</th>
                        <th>QUANTITY</th>
                        <th className="width-150">TOTAL</th>
                        <th className="text-right">#</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ProductTableBody
                        products={invoiceProducts}
                        onChangeProduct={null}
                        removeProductFromInvoice={null}
                        disableState={true}
                      />
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className="row invoice-payment">
                    <div className="col-sm-7"></div>
                    <div className="col-sm-5">
                      <div className="m-b-20">
                        <div className="table-responsive no-border">
                          <table className="table mb-0">
                            <tbody>
                              <tr>
                                <th>Subtotal:</th>
                                <td className="text-right">
                                  $<span>{getTotalPrice.totalPrice}</span>
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  Tax:{" "}
                                  <span className="text-regular">
                                    <input
                                      type="number"
                                      className="tax-input"
                                      onChange={(e) => setTax(e.target.value)}
                                      value={tax}
                                      disabled={true}
                                    />
                                    %
                                  </span>
                                </th>
                                <td className="text-right">
                                  $<span>{getTotalPrice.taxPrice}</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Total:</th>
                                <td className="text-right text-primary">
                                  <h5>${getTotalPrice.sum}</h5>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="invoice-info">
                    <h5>Other information</h5>
                    <p className="text-muted">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vivamus sed dictum ligula, cursus blandit risus. Maecenas
                      eget metus non tellus dignissim aliquam ut a ex. Maecenas
                      sed vehicula dui, ac suscipit lacus. Sed finibus leo vitae
                      lorem interdum, eu scelerisque tellus fermentum. Curabitur
                      sit amet lacinia lorem. Nullam finibus pellentesque
                      libero, eu finibus sapien interdum vel
                    </p>
                    <div className="text-right mt-3">
                      <button
                        onClick={showCardPayForm}
                        className="btn btn-primary btn-sm mr-2"
                      >
                        Pay With Card
                      </button>
                    </div>
                    <StripeModal
                      show={stripeCardModalIsOpen}
                      onHide={() => setStripeCardModalOpen(false)}
                      clientInfo={sClient}
                      payAmount={getTotalPrice.sum}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default InvoicePayment;
