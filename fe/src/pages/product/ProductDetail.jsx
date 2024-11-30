import { useEffect, useState } from "react";
import Loading from "../../components/common/alert/Loading";
import { getDataAPI } from "../../utils/fetchData";
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { addProduct } from "../../redux/actions/cartActions";
import { formatNumberWithCommas } from "../../utils/stringUtils";
import { followProduct, PRODUCT_ACTION_TYPES, unfollowProduct } from "../../redux/actions/productActions";
import { getEmptyOrder, ORDER_ACTION_TYPES } from "../../redux/actions/orderActions";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const follwedProductStyle = "text-[#ff0000] hover:text-inherit"
const notFollwedProductStyle = "text-inherit hover:text-[--secondary-text-color]"

const ProductDetail = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const auth = useSelector(state => state.auth);
    const followings = useSelector(state => state.product.following);
    const order = useSelector(state => state.order);
    const [selectedProductOption, setSelectedProductOption] = useState(null);

    const dispatch = useDispatch()
    const path = window.location.pathname.split('/').reverse()[0]

    useEffect(() => {
        if (!product) {
            setIsLoading(true);
            getDataAPI(`product/detail/${path}`)
                .then(res => {
                    setIsLoading(false);
                    if (res.status === 200) {
                        setProduct(res.data.product);
                        let defaultOption = res.data.product.product_options[0]
                        setSelectedProductOption(defaultOption)
                    } else {
                        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message });
                    }
                })
                .catch(err => {
                    setIsLoading(false);
                    dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: 'Có lỗi xảy ra khi lấy dữ liệu sản phẩm!' });
                });
        }
    }, [path, dispatch, product]);


    const currentProductFollow = followings?.find(following => following.product.id === product?.id)
    const followingStyle = currentProductFollow ? follwedProductStyle : notFollwedProductStyle

    const CustomMarkdown = ({ children }) => {
        return (<ReactMarkdown
            className='markdown p-[20px] bg-[--primary-background-color] text-[--primary-text-color] overflow-y-auto outline-none text-[1rem]'
            children={children}
            components={{
                img: ({ node, ...props }) => {
                    return (<img {...props} className="max-w-[100%]" alt={props.alt} />)
                },
                h2: ({ node, ...props }) => {
                    return (<h2 {...props} className="text-[--primary-text-color] font-bold m-4" children={props.children} />)
                },
                h3: ({ node, ...props }) => {
                    return (<h3 {...props} className="text-[--primary-text-color] font-bold m-3" children={props.children} />)
                },
                li: ({ node, ...props }) => {
                    return (<li {...props} className="select-all m-2 ml-8" />)
                },
                p: ({ node, ...props }) => {
                    return (<p {...props} className="mb-4" />)
                },
            }}
        />)
    }

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleIncreaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1)
        }
    }

    const handleQuantityChange = (e) => {
        if (e.target.value === '') {
            setQuantity(1)
            return
        }
        const value = parseInt(e.target.value)
        if (value > product.stock) {
            setQuantity(product.stock)
        }
        else if (value < 1) {
            setQuantity(1)
        }
        else {
            setQuantity(value)
        }
    }

    const handleAddToCart = () => {
        dispatch(addProduct({ product, quantity, product_option: selectedProductOption, token: auth.token }))
    }

    const handleFollowProduct = () => {
        if (!currentProductFollow) {
            if (auth.token) {
                dispatch(followProduct({ product, token: auth.token }))
            } else {
                dispatch({ type: PRODUCT_ACTION_TYPES.FOLLOW_PRODUCT, payload: { product } })
            }
        } else {
            if (auth.token) {
                dispatch(unfollowProduct({ product, token: auth.token }))
            } else {
                dispatch({ type: PRODUCT_ACTION_TYPES.UNFOLLOW_PRODUCT, payload: { product } })
            }
        }
    }

    const handleCheckOut = () => {
        dispatch(getEmptyOrder(auth.token))
        dispatch({ type: ORDER_ACTION_TYPES.ADD_ORDER_ITEM, payload: { product, quantity, product_option: selectedProductOption } })
    }

    const hanleChangeProductOption = (e) => {
        setSelectedProductOption(product.product_options.find(option => option.id === parseInt(e.target.value)))
    }

    useEffect(() => {
        if (order.order_items?.length > 0) {
            navigate('/cart/checkout/confirm-information')
        }
    }, [order.order_items, navigate])

    return (
        <>
            <Helmet>
                <title>{product?.name}</title>
                <meta name="description" content={product?.detail} />
                <meta name="keywords" content={product?.name} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.example.com" />
                <meta property="og:title" content="Phụ Tùng Xe Hơi - Trang Chủ" />
                <meta property="og:description" content={product?.detail} />
                <meta property="og:image" content={product?.image_url} />
                <meta property="og:url" content="https://www.example.com" />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="flex flex-col justify-center items-center w-full bg-[--primary-background-color] text-[--primary-text-color]">
                {
                    (isLoading && <Loading />) ||
                    (product &&
                        (<div className="flex w-full md:w-[80%] bg-[--primary-background-color] text-[--primary-text-color]">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col w-full py-4 md:flex-row justify-between">
                                    <img className="w-full md:w-[40%] md:max-h-[300px] object-contain p-2" src={product.image_url} alt={product.name} />
                                    <div className="flex flex-col p-2">
                                        <h2 className="select-all">{product.name}</h2>
                                        <h4 className="text-[--color-red] mb-4">{formatNumberWithCommas(product.price)} {product.currency}</h4>
                                        <p>{formatNumberWithCommas(product.stock)} sản phẩm có sẵn</p>

                                        <div className="flex pb-4">
                                            <div className={"flex p-2 cursor-pointer"}
                                                onClick={handleFollowProduct}
                                            >
                                                <i className={`fas fa-heart ${followingStyle}`}></i>
                                            </div>
                                        </div>

                                        <div className="flex flex-row items-center mb-4">
                                            <div className="decrease-button cursor-pointer" onClick={handleDecreaseQuantity}>
                                                <i className="fas fa-minus"></i>
                                            </div>
                                            <input className="quantity-input w-8 outline-0 border-none text-center" value={quantity} onChange={(e) => handleQuantityChange(e)} />
                                            <div className="increase-button cursor-pointer" onClick={handleIncreaseQuantity}>
                                                <i className="fas fa-plus"></i>
                                            </div>
                                        </div>

                                        <div className="mb-4 flex flex-col">
                                            <label htmlFor='product_option'>Option</label>
                                            <select id='product_option' name='product_option' className="w-full p-2" onChange={hanleChangeProductOption}>
                                                {
                                                    product.product_options?.map((option, index) => (
                                                        <option disabled={option.stock === 0} key={index} value={option.id}>{option.name} - {option.price}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="mb-4 flex">
                                            <span className="mr-2">Tổng tiền:</span>
                                            <span>{formatNumberWithCommas(selectedProductOption.price * quantity)} {product.currency}</span>
                                        </div>
                                        <div className="actions flex justify-between">
                                            <button className="btn btn-primary w-[40%] min-w-[120px]"
                                                onClick={() => handleCheckOut()}
                                            >
                                                Mua ngay
                                            </button>
                                            <button className="btn btn-primary w-[40%] min-w-[120px]"
                                                onClick={handleAddToCart}
                                            >
                                                Thêm vào giỏ hàng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <CustomMarkdown children={product?.detail} />
                            </div>
                        </div>
                        )
                    )
                }
            </div>
        </>
    )
}

export default ProductDetail;