module.exports = function(app, { User, Cart, ContactMessage, bcrypt, requireAuth }) {
    
    // Helper to get cart count
    const getCartCount = async (userId) => {
        if (!userId) return 0;
        try {
            const cart = await Cart.findOne({ userId });
            return cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        } catch (error) {
            console.error('Cart count error:', error);
            return 0;
        }
    };

    // ================= ROUTES ================= //

    // Redirect root to login
    app.get('/', (req, res) => {
        if (req.session.user) {
            return res.redirect('/home');
        }
        res.redirect('/login');
    });

    // Home Route (protected)
    app.get('/home', requireAuth, async (req, res) => {
        const cartCount = await getCartCount(req.session.user?.id);
        
        res.render('index', {
            title: 'MobileHub - Your Mobile Marketplace',
            heroTitle: 'Find Your Perfect Mobile Device',
            heroSubtitle: 'Buy and sell smartphones at the best prices from trusted sellers',
            heroImage: 'https://cdn.dribbble.com/userupload/19792761/file/original-1fed1c044773c4ec7b33b4c07bdec838.gif',
            categories: [
                { name: 'Flagship', emoji: '📱' },
                { name: 'Budget', emoji: '💰' },
                { name: 'Refurbished', emoji: '♻️' },
                { name: 'Gaming', emoji: '🎮' },
                { name: 'Camera', emoji: '📸' }
            ],
            products: [
                { 
                    id: '1',
                    name: 'iPhone 15 Pro', 
                    price: 999, 
                    originalPrice: 1099, 
                    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096' 
                },
                { 
                    id: '2',
                    name: 'Samsung Galaxy S23 Ultra', 
                    price: 899, 
                    originalPrice: 1199, 
                    image: 'https://m.media-amazon.com/images/I/71lD7eGdW-L.jpg' 
                },
                { 
                    id: '3',
                    name: 'Google Pixel 8 Pro', 
                    price: 799, 
                    originalPrice: 999, 
                    image: 'https://i.pinimg.com/736x/35/dc/2a/35dc2a7473c7fcdf24799b2f187dbf45.jpg' 
                },
                { 
                    id: '4',
                    name: 'OnePlus 11 5G', 
                    price: 699, 
                    originalPrice: 799, 
                    image: 'https://m.media-amazon.com/images/I/61amb0CfMGL._AC_UF1000,1000_QL80_.jpg' 
                }
            ],
            user: req.session.user,
            cartCount
        });
    });

    // Products Route (protected)
    app.get('/products', requireAuth, (req, res) => {
        const products = [
            { 
                id: '5', 
                name: "Xiaomi 13 Pro", 
                price: 899, 
                image: "https://i01.appmifile.com/webfile/globalimg/products/pc/xiaomi-13-pro/specs-header.png" 
            },
            { 
                id: '6', 
                name: "Oppo Find X6 Pro", 
                price: 1099, 
                image: "https://image.oppo.com/content/dam/oppo/common/mkt/v2-2/find-x6-pro/navigation/Find-X6-Pro-navigation-blue-v2.png" 
            },
            { 
                id: '7', 
                name: "Vivo X90 Pro", 
                price: 999, 
                image: "https://www.vivo.com/content/dam/vivo/in/v3/2023/vivo-x90-pro-plus/product-list/x90-pro-plus-black.png" 
            },
            { 
                id: '8', 
                name: "Nothing Phone 2", 
                price: 599, 
                image: "https://cdn.shopify.com/s/files/1/0633/2068/6808/files/Nothing-phone-2-white_900x.png" 
            }
        ];
        res.render('products', { 
            title: "Premium Mobile Collection", 
            products, 
            user: req.session.user 
        });
    });

    // Deals Route (protected)
    app.get('/deals', requireAuth, async (req, res) => {
        try {
            const deals = [
                {
                    id: 'deal1',
                    name: 'iPhone 14 Pro (256GB)',
                    originalPrice: 1099,
                    dealPrice: 899,
                    discount: '18% OFF',
                    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703841896',
                    expiry: '2025-12-31'
                },
                {
                    id: 'deal2',
                    name: 'Samsung Galaxy Z Flip 5',
                    originalPrice: 999,
                    dealPrice: 849,
                    discount: '15% OFF',
                    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-z-flip5-f731-538355-538355-sm-f731blvhins-thumb-537371737',
                    expiry: '2025-11-30'
                },
                {
                    id: 'deal3',
                    name: 'Google Pixel 7 Pro',
                    originalPrice: 899,
                    dealPrice: 649,
                    discount: '28% OFF',
                    image: 'https://storage.googleapis.com/play_public/supported_devices/Google_Pixel_7_Pro.png',
                    expiry: '2025-10-15'
                }
            ];

            const cartCount = await getCartCount(req.session.user?.id);

            res.render('deals', {
                title: 'Mobile Deals of the Day',
                deals,
                user: req.session.user,
                cartCount
            });
        } catch (error) {
            console.error('Deals page error:', error);
            res.status(500).render('error', { message: 'Error loading mobile deals' });
        }
    });

    // Cart Count API Route
    app.get('/api/cart/count', async (req, res) => {
        if (!req.session.user) {
            return res.json({ count: 0 });
        }
        
        try {
            const cart = await Cart.findOne({ userId: req.session.user.id });
            const count = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            res.json({ count });
        } catch (error) {
            console.error('Cart count error:', error);
            res.json({ count: 0 });
        }
    });

    // Cart Routes (protected)
    app.get('/cart', requireAuth, async (req, res) => {
        try {
            const cart = await Cart.findOne({ userId: req.session.user.id });
            const total = cart ? cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

            res.render('cart', {
                title: 'Your Mobile Cart',
                cart: cart || { items: [] },
                total: total.toFixed(2),
                user: req.session.user
            });
        } catch (error) {
            console.error('Cart error:', error);
            res.status(500).render('error', { message: 'Error loading your mobile cart' });
        }
    });

    app.post('/add-to-cart', requireAuth, async (req, res) => {
        try {
            const { productId, name, price, image } = req.body;
            let cart = await Cart.findOne({ userId: req.session.user.id });

            if (!cart) {
                cart = new Cart({
                    userId: req.session.user.id,
                    items: [{ productId, name, price, image, quantity: 1 }]
                });
            } else {
                const existingItem = cart.items.find(item => item.productId === productId);
                existingItem ? existingItem.quantity++ : cart.items.push({ productId, name, price, image, quantity: 1 });
            }

            await cart.save();
            res.json({ 
                success: true, 
                cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0) 
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            res.status(500).json({ success: false, message: 'Error adding mobile to cart' });
        }
    });

    app.post('/update-cart-item', requireAuth, async (req, res) => {
        const { productId, quantity } = req.body;

        if (!productId || quantity == null || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Invalid request data' });
        }

        try {
            const cart = await Cart.findOne({ userId: req.session.user.id });
            if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

            const item = cart.items.find(item => item.productId === productId);
            if (!item) return res.status(404).json({ success: false, message: 'Mobile not found in cart' });

            item.quantity = quantity;
            await cart.save();

            const updatedTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            res.json({ 
                success: true, 
                message: 'Mobile quantity updated successfully', 
                updatedItem: item,
                total: updatedTotal.toFixed(2)
            });
        } catch (error) {
            console.error('Update cart item error:', error);
            res.status(500).json({ success: false, message: 'Server error updating mobile quantity' });
        }
    });

    app.post('/remove-from-cart', requireAuth, async (req, res) => {
        const { productId } = req.body;
        
        try {
            const cart = await Cart.findOne({ userId: req.session.user.id });
            if (!cart) return res.status(404).json({ success: false });

            cart.items = cart.items.filter(item => item.productId !== productId);
            await cart.save();
            
            res.json({ 
                success: true,
                cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
            });
        } catch (error) {
            console.error('Remove from cart error:', error);
            res.status(500).json({ success: false });
        }
    });

    // Contact Routes
    app.get('/contact', async (req, res) => {
        try {
            const messages = await ContactMessage.find().sort({ createdAt: -1 });
            const cartCount = await getCartCount(req.session.user?.id);

            res.render('contact', {
                title: 'MobileHub Support',
                user: req.session.user,
                messages: messages || [],
                success: req.query.success,
                error: req.query.error,
                cartCount
            });
        } catch (err) {
            console.error('Error loading contact page:', err);
            res.render('contact', {
                messages: [],
                error: 'Failed to load messages'
            });
        }
    });

    app.post('/contact', async (req, res) => {
        try {
            const { name, email, message } = req.body;
            if (!name || !email || !message) {
                return res.redirect('/contact?error=All+fields+are+required');
            }
            
            await ContactMessage.create({ name, email, message });
            res.redirect('/contact?success=Message+sent+successfully');
        } catch (err) {
            console.error('Error saving message:', err);
            res.redirect('/contact?error=Failed+to+send+message');
        }
    });

    app.get('/contact/edit/:id', async (req, res) => {
        try {
            const message = await ContactMessage.findById(req.params.id);
            const messages = await ContactMessage.find().sort({ createdAt: -1 });
            const cartCount = await getCartCount(req.session.user?.id);

            if (!message) {
                return res.redirect('/contact?error=Message+not+found');
            }

            res.render('contact', {
                title: 'Edit Support Message',
                user: req.session.user,
                message,
                messages,
                cartCount,
                success: req.query.success,
                error: req.query.error
            });
        } catch (err) {
            console.error('Error loading edit page:', err);
            res.redirect('/contact?error=Error+loading+message');
        }
    });

    app.post('/contact/update/:id', async (req, res) => {
        try {
            const { name, email, message, _id } = req.body;
            
            if (!name || !email || !message) {
                return res.redirect(`/contact/edit/${_id}?error=All+fields+are+required`);
            }

            await ContactMessage.findByIdAndUpdate(_id, {
                name,
                email,
                message,
                updatedAt: Date.now()
            });

            res.redirect('/contact?success=Message+updated+successfully');
        } catch (err) {
            console.error('Error updating message:', err);
            res.redirect(`/contact/edit/${req.params.id}?error=Failed+to+update+message`);
        }
    });

    app.post('/contact/delete/:id', async (req, res) => {
        try {
            await ContactMessage.findByIdAndDelete(req.params.id);
            res.redirect('/contact?success=Message+deleted+successfully');
        } catch (err) {
            console.error('Error deleting message:', err);
            res.redirect('/contact?error=Failed+to+delete+message');
        }
    });

    // Auth Routes
    app.get('/login', (req, res) => {
        if (req.session.user) {
            return res.redirect('/home');
        }
        res.render('login', { 
            errorMessage: null, 
            user: req.session.user 
        });
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { 
                errorMessage: 'Please enter both email and password to access MobileHub.', 
                user: req.session.user 
            });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('login', { 
                    errorMessage: 'No MobileHub account found with this email.', 
                    user: req.session.user 
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.render('login', { 
                    errorMessage: 'Incorrect password. Please try again.', 
                    user: req.session.user 
                });
            }

            req.session.user = { 
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            };
            res.redirect('/home');
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).render('login', { 
                errorMessage: 'Error logging into MobileHub. Please try again.',
                user: req.session.user
            });
        }
    });

    app.get('/signup', (req, res) => {
        if (req.session.user) {
            return res.redirect('/home');
        }
        res.render('signup', { 
            signupError: null, 
            user: req.session.user 
        });
    });

    app.post('/signup', async (req, res) => {
        const { newEmail: email, newPassword: password } = req.body;

        if (!email || !password) {
            return res.render('signup', { 
                signupError: 'Email and password are required to create your MobileHub account.', 
                user: req.session.user 
            });
        }

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('signup', { 
                    signupError: 'This email is already registered with MobileHub.', 
                    user: req.session.user 
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();
            res.redirect('/login');
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).render('signup', { 
                signupError: 'Error creating your MobileHub account. Please try again.',
                user: req.session.user
            });
        }
    });

    app.get('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Logout error:', err);
                return res.redirect('/home');
            }
            res.redirect('/login');
        });
    });
};