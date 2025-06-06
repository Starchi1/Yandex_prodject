import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeed,
  selectIsFeedLoading,
  selectOrders
} from '../../slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const isFeedLoading = useSelector(selectIsFeedLoading);
  const orders: TOrder[] = useSelector(selectOrders);

  const handleGetsFeeds = () => dispatch(getFeed());

  useEffect(() => {
    handleGetsFeeds();
  }, [dispatch]);

  if (!orders.length || isFeedLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetsFeeds} />;
};
