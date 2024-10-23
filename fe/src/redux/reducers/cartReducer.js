import { CART_ACTION_TYPES } from '../actions/cartActions'

const initialState = {
    items: [],
    synced: false
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_ACTION_TYPES.ADD_TO_CART:
            return {
                ...state,
                items: [...state.items, action.payload]
            }
        case CART_ACTION_TYPES.REMOVE_FROM_CART:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id)
            }
        case CART_ACTION_TYPES.CLEAR_CART:
            return {
                ...state,
                items: []
            }
        case CART_ACTION_TYPES.GET_CART_ITEMS_FROM_STORAGE:
            return {
                ...state,
                items: action.payload
            }
        case CART_ACTION_TYPES.GET_CART:
            return {
                items: action.payload
            }
        case CART_ACTION_TYPES.SYNC_CART:
            return {
                ...state,
                synced: true
            }
        case CART_ACTION_TYPES.NOT_SYNC_CART:
            return {
                ...state,
                synced: false
            }
        default:
            return state
    }
}

export default cartReducer