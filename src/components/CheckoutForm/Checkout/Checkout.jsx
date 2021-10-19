import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import { commerce } from '../../../lib/commerce';

import useStyles from './style';

import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    // Properties
    const classes = useStyles();
    const history = useHistory();
    const [isFinished, setIsFinished] = useState(false);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});

    // useEffect
    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'});

                setCheckoutToken(token);
            } catch(err) {
                history.pushState('/')
            }
        }

        generateToken();
    }, [cart]);

    // Event Handlers
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const backStep = () => setActiveStep((prevActiveStep => prevActiveStep - 1));

    const test = (data) => {
        setShippingData(data);
        nextStep();
    }

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    }

    // Sub-components
    const Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant='h5'>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant='h5'>Thank you for your purchase</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if (error) {
        <>
            <Typography variant='h5'>Error: {error}</Typography>
            <br/>
            <Button component={Link} to='/' variant='outlined' type='button' />
        </>
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} test={test} />
        : <PaymentForm checkoutToken={checkoutToken} shippingData={shippingData} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map(step => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    { activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form /> }
                </Paper>
            </main>
        </>
    )
}

export default Checkout
