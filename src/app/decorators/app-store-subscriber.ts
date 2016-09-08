
import {AppStore} from '../services/app-store'
import {Observable} from 'rxjs/Observable'
import {Subscription} from 'rxjs/Subscription'

const onDestroyName = 'ngOnDestroy'
const onInitName = 'ngOnInit'
const onInitAppStoreSubscriptionName = 'onInitAppStoreSubscription'
const componentSubscriptionsName = Symbol('ComponentSubscriptions')

export interface IAppStoreSubscriber {
    onInitAppStoreSubscription(source: Observable<any>): Subscription
}

export function AppStoreSubscriber() {
    const { defineProperty } = Object
    return function(target) {

        let ngOnDestroyOriginal, ngOnInitOriginal, onInitAppStoreSubscription
        const targetPrototype = target.prototype;

        if (typeof targetPrototype[onInitAppStoreSubscriptionName] === 'function') {
            onInitAppStoreSubscription = targetPrototype[onInitAppStoreSubscriptionName]
        } else {
            throw new Error(`The required method, ${onInitAppStoreSubscriptionName}, was not defined on the object.`)
        }

        if (typeof targetPrototype[onInitName] === 'function') {
            ngOnInitOriginal = targetPrototype[onInitName]
        }
        if (typeof targetPrototype[onDestroyName] === 'function') {
            ngOnDestroyOriginal = targetPrototype[onDestroyName]
        }

        defineProperty(targetPrototype, onInitName, {
            configurable: true,
            enumerable: true,
            get() {
                return () => {
                    if (ngOnInitOriginal) {
                        ngOnInitOriginal.bind(this)()
                    }
                    let subscription = onInitAppStoreSubscription.bind(this)(AppStore.instance.source)
                    if (!Array.isArray(subscription)) {
                        subscription = [subscription]
                    }
                    this[componentSubscriptionsName] = [...subscription]
                }
            }
        });

        defineProperty(targetPrototype, onDestroyName, {
            configurable: true,
            enumerable: true,
            get() {
                return () => {
                    if (ngOnDestroyOriginal) {
                        ngOnDestroyOriginal.bind(this)()
                    }
                    let subscriptionList = this[componentSubscriptionsName]
                    subscriptionList.forEach((subscription: any) => subscription.unsubscribe())
                    delete this[componentSubscriptionsName]
                }
            }
        });
    }
}
