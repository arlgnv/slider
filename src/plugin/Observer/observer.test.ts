import Observer from './Observer';

const observer = new Observer();
const cb = jest.fn();

describe('Подписка и уведомления о событиях', () => {
  it('Корректно работает подписка и уведомление', () => {
    observer.subscribe('updatedState', cb);
    observer.notify('updatedState');

    expect(cb).toHaveBeenCalled();
  });
});

describe('Отписка от события', () => {
  it('Корректно отписывается от события', () => {
    const newCb = jest.fn();
    
    observer.subscribe('updatedState', newCb);
    observer.unsubscribe('updatedState', newCb);
    observer.notify('updatedState');

    expect(newCb).not.toHaveBeenCalled();
  });
});