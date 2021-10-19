import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
	// Properties
	const [products, setProducts] = useState([]);
	const [cart, setCart] = useState({});
	const [order, setOrder] = useState({});
	const [errMessage, setErrMessage] = useState('');

	// Events
	const fetchProducts = async () => {
		const { data } = await commerce.products.list();

		setProducts(data);
	};

	const fetchCart = async () => {
		setCart(await commerce.cart.retrieve());
	};

	const handleAddToCart = async (productId, quantity) => {
		const { cart } = await commerce.cart.add(productId, quantity);

		setCart(cart);
	};

	const handleUpdateCartQty = async (productId, quantity) => {
		const { cart } = await commerce.cart.update(productId, { quantity });

		setCart(cart);
	};

	const handleRemoveFromCart = async (productId) => {
		const { cart } = await commerce.cart.remove(productId);

		setCart(cart);
	};

	const handleEmptyCart = async () => {
		const { cart } = await commerce.cart.empty();

		setCart(cart);
	};

	const refreshCart = async () => {
		const cart = await commerce.cart.refresh();

		setCart(cart);
	};

	const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
		try {
			const incomingOrder = await commerce.checkout.capture(
				checkoutTokenId,
				newOrder
			);

			setOrder(incomingOrder);
			refreshCart();
		} catch (error) {
			setErrMessage(error.data.error.message);
		}
	};

	// The second parameter which is an empty array, it means that only run at the start
	// Inclass based component, it is called component did mount
	useEffect(() => {
		fetchProducts();
		fetchCart();
	}, []);

	return (
		<Router>
			<div>
				<Navbar totalItems={cart.total_items} />
				<Switch>
					<Route exact path='/'>
						<Products products={products} onAddToCart={handleAddToCart} />
					</Route>
					<Route exact path='/cart'>
						<Cart
							cart={cart}
							handleUpdateCartQty={handleUpdateCartQty}
							handleRemoveFromCart={handleRemoveFromCart}
							handleEmptyCart={handleEmptyCart}
						/>
					</Route>
					<Route exact path='/checkout'>
						<Checkout
							cart={cart}
							order={order}
							onCaptureCheckout={handleCaptureCheckout}
							error={errMessage}
						/>
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
