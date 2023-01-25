import { FC, useEffect, useMemo, useState } from 'react';
import Plot, { PlotParams } from 'react-plotly.js';
import { LazyFigureApi } from '../../@types/view';
import { Spinner } from '../Spinner';
import { useAtom } from 'jotai';
import { lazyPlots } from '../../contexts/UploadContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from './LazyFigures.module.css';
import { ChartBarSquareIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

interface LazyFiguresProps {
  figure: PlotParams;
  lazyApi: LazyFigureApi[];
}

export const LazyFigures: FC<LazyFiguresProps> = ({ figure, lazyApi }) => {
  const [ figureUrl, setFigureUrl ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    setFigureUrl('');
    setIsLoading(false);
  }, [figure, lazyApi]);

  const [cachedLazyPlots, setCachedLazyPlots] = useAtom(lazyPlots);

  const handleButtonClick = async (url: string): Promise<void> => {
    if (url === figureUrl) {
      return;
    }

    if (!url) {
      setFigureUrl('');
      return;
    }

    if (!cachedLazyPlots[url]) {
      setIsLoading(true);
      try {
        const { data } = await axios.post<PlotParams>(url);
        setCachedLazyPlots({
          ...cachedLazyPlots,
          [url]: data,
        });
      } catch (e) {
        toast.error((e as Error).message);
      }
      setIsLoading(false);
    }
    setFigureUrl(url);
  };

  const currentFigure = figureUrl ? cachedLazyPlots[figureUrl] : figure;
  const buttons = useMemo(() => [{ api: '', title: '' }, ...lazyApi ], [lazyApi]);

  return (
    <div className={`grid grid-cols-12 gap-4 my-4 ${styles.wrapper}`}>
      <div className="col-span-11 w-full flex flex-col justify-center items-center">
      {
        isLoading
          ? <Spinner />
          : (
            <Plot
              data={currentFigure.data}
              layout={currentFigure.layout}
            />
          )
      }
      </div>
      {!!lazyApi.length && (
        <div className="flex flex-col items-center">
          {buttons.map((item, idx) => {
            const isCurrent = (figureUrl === item.api);
            return (
              <button
                key={item.api}
                className={classNames('m-1 h-8 w-8 hover:text-white', {
                  'text-white': isCurrent,
                  'text-primary': !isCurrent && ((idx % 4) === 0),
                  'text-cyan': !isCurrent && ((idx % 4) === 1),
                  'text-near-orange': !isCurrent && ((idx % 4) === 2),
                  'text-near-gray': !isCurrent && ((idx % 4) === 3),
                })}
                disabled={isLoading || isCurrent}
                onClick={() => handleButtonClick(item.api)}
                title={item.title}
              >
                <ChartBarSquareIcon />
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};
