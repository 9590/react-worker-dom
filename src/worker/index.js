import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import invariant from 'invariant';

import inject from './ReactWWInjection';
import ReactWWIDOperations from './ReactWWIDOperations';
import WorkerDomNodeStub from './WorkerDomNodeStub';

/**
 * Injecting dependencies.
 */
inject();

/**
 * Renders the given react element using a web worker.
 *
 * @param  {ReactElement}   element   - Node to update.
 * @return {ReactComponent}           - The rendered component instance.
 */
function render(element, callback) {
    // Is the given element valid?
    invariant(
        ReactElement.isValidElement(element),
        'render(): You must pass a valid ReactElement.'
    );

    const id = ReactInstanceHandles.createReactRootID(0); // Creating a root id & creating the screen
    const component = instantiateReactComponent(element); // Mounting the app
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();

    //ReactWWIDOperations.setRoot(new WorkerDomNodeStub('0', 'div', {}));

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.
    ReactUpdates.batchedUpdates(() => {
        transaction.perform(() => {
            component.mountComponent(transaction, id, { _idCounter: 0 });
            if (typeof callback === 'function') {
                callback(component.getPublicInstance());
            }
        });
        ReactUpdates.ReactReconcileTransaction.release(transaction);
    });

    return component._instance;
}

module.exports = {
    render: render
};
