import React, { useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { ContactInformation } from './ContactInformation/ContactInformation';
import { Step } from './Step/Step';

const checkoutSteps = {
  contactInformation: 'contact-information',
  billingInformation: 'billing-information',
  paymentInformation: 'payment-information',
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(checkoutSteps.contactInformation);
  const intl = useIntl();

  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const setNextCheckoutStep = async () => {
    let nextStep = activeStep;

    switch (activeStep) {
      case checkoutSteps.contactInformation:
        nextStep = checkoutSteps.billingInformation;
        break;
      case checkoutSteps.billingInformation:
        nextStep = checkoutSteps.paymentInformation;
        break;
      case checkoutSteps.paymentInformation:
        nextStep = checkoutSteps.paymentInformation;
        break;
      default:
        nextStep = checkoutSteps.contactInformation;
        break;
    }

    setActiveStep(nextStep);
  };

  return (
    <>
      <Helmet>
        <title>{_('checkoutProcessForm.title')}</title>
        <meta name="invoices" />
      </Helmet>
      <HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12">
              <h2>{_('checkoutProcessForm.title')}</h2>
            </div>
          </div>
        </section>
      </HeaderSection>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12">
            <h3 className="m-b-24">{_('checkoutProcessForm.title')}</h3>
          </div>
          <div className="col-lg-8 col-md-12 m-b-24">
            <div className="dp-wrapper-payment-process">
              <ul className="dp-accordion">
                <Step
                  active={activeStep === checkoutSteps.contactInformation}
                  title={_('checkoutProcessForm.contact_information_title')}
                  complete={true}
                  stepNumber={1}
                  onActivate={() => setActiveStep(checkoutSteps.contactInformation)}
                >
                  <ContactInformation handleSaveAndContinue={setNextCheckoutStep} />
                </Step>
                <Step
                  active={activeStep === checkoutSteps.billingInformation}
                  title={_('checkoutProcessForm.billing_information_title')}
                  complete={false}
                  stepNumber={2}
                ></Step>
                <Step
                  active={activeStep === checkoutSteps.paymentInformation}
                  title={_('checkoutProcessForm.payment_method_title')}
                  complete={false}
                  stepNumber={3}
                ></Step>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(Checkout);
