import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  queryNullableFilter<T>(query: T): Record<keyof T, NonNullable<T[keyof T]>> {
    const _isJsonObject = (d: any): d is Record<string, any> => {
      if (typeof d !== 'string') {
        try {
          d = JSON.stringify(d);
        } catch {
          return false;
        }
      }

      try {
        JSON.parse(d);
        if (d[0] !== '{') return false;
        return true;
      } catch {
        return false;
      }
    };

    const _filter = (
      query: Record<string, any> | any[] | Exclude<any, undefined | null>,
      allowDepth = -1,
      currentDepth = 0,
    ): any /* TODO determine type*/ => {
      if (!query) return; // null, undefined

      if (Array.isArray(query)) {
        // array embranchment
        query = query.filter((v) => !!v); // removing null/undefined item in array

        if (query.length === 0) return; // null check

        if (allowDepth !== -1 && currentDepth > allowDepth) {
          // concerning recursive depth
          return query;
        }

        const newArray: any[] = [];

        for (const element of query) {
          // recursive array iteration
          if (Array.isArray(element) || _isJsonObject(element)) {
            // If iterable
            const res = _filter(element, allowDepth, currentDepth + 1);
            if (!!res) {
              newArray.push(res); // If iterable and valid value - add to newArray
            }
          } else {
            newArray.push(element); // If not iterable return plain value
          }
        }

        if (newArray.length !== 0) {
          // Check refined array doesn't have any valuable datas
          return newArray;
        }
        return;
      }

      if (_isJsonObject(query)) {
        // JSON object embranchment
        query = Object.entries(query).reduce((prev: unknown, [key, value]) => {
          if (!value) return prev;
          return Object.assign({}, prev as Record<string, any>, {
            [key]: value,
          });
        }, {});

        if (allowDepth !== -1 && currentDepth > allowDepth + 1) {
          // concerning recursive depth
          if (Object.keys(query).length === 0) return;
          return query;
        }

        query = Object.entries(query) // recursive Object iteration
          .reduce((prev: unknown, [key, value]) => {
            if (Array.isArray(value) || _isJsonObject(value)) {
              const newObj = _filter(value);
              if (!newObj || Object.keys(newObj).length === 0) return prev;
              return Object.assign({}, prev as Record<string, any>, {
                [key]: newObj,
              });
            }
            return Object.assign({}, prev, { [key]: value });
          }, {});

        if (Object.keys(query).length === 0) return;
        return query;
      }

      return query;
    };

    return _filter(query);
  }
}
