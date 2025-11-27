import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import LoginView from '../components/LoginView.vue'
import RegistrationView from '../components/RegistrationView.vue'
import CartView from "../components/CartView.vue";
import CatalogView from "../components/CatalogView.vue";
import UserList from "../components/UserList.vue"
import UserShow from '@/components/UserShow.vue';
import UserEdit from '@/components/UserEdit.vue';
import CategoriesList from '@/components/CategoriesList.vue';
import CategoriesEdit from '@/components/CategoriesEdit.vue';
import CategoriesShow from '@/components/CategoriesShow.vue';
import CategoriesCreate from '@/components/CategoriesCreate.vue';

import ProductsList from '@/components/ProductsList.vue';
import ProductsEdit from '@/components/ProductsEdit.vue';
import ProductsCreate from '@/components/ProductsCreate.vue';
import ProductsShow from '@/components/ProductsShow.vue';


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
        path: '/catalog',
        name: 'catalog',
        component: CatalogView
    },
    {
      path: '/users',
      name: 'user-list',
      component: UserList
    },
    {
      path: '/users/:id',
      name: 'user-show',
      component: UserShow
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: UserEdit
    },

    {
      path: '/categories',
      name: 'categories-list',
      component: CategoriesList
    },

    {
      path: '/categories/:id',
      name: 'categories-show',
      component: CategoriesShow
    },
    
    {
      path: '/categories/:id/edit',
      name: 'categories-edit',
      component: CategoriesEdit
    },
    
    {
      path: '/categories/create',
      name: 'categories-create',
      component: CategoriesCreate
    },

    {
      path:'/products',
      name: 'products-list',
      component: ProductsList
    },
    {
      path: '/products/:id/edit',
      name: 'products-edit',
      component: ProductsEdit
    },
    {
      path: '/products/:id',
      name: 'products-show',
      component: ProductsShow
    },
    {
      path: '/products/create',
      name: 'products-create',
      component: ProductsCreate
    }

  ]
})

export default router