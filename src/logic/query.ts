/* eslint-disable @typescript-eslint/no-explicit-any */
import { query, mutate, subscribe, forget, abort } from "turbo-query";
import {
  computed,
  ref,
  watch,
  readonly,
  onUnmounted,
  getCurrentInstance,
  inject,
} from "vue";
import type {
  TurboQuery,
  TurboQueryOptions,
  TurboMutateValue,
} from "turbo-query";
import type { Ref, InjectionKey } from "vue";

const injectionKey = Symbol(
  "turbo-vue-context"
) as InjectionKey<TurboVueOptions>;

export function injectTurboVue(value?: TurboVueOptions) {
  return inject(injectionKey, value);
}

export interface TurboVueOptions extends TurboQueryOptions {
  /**
   * A default turbo query instance to use if any.
   */
  turbo?: TurboQuery;

  /*
   * Prevent the request from firing until the `refetch` method is called
   * or the computed key changed.
   */
  immediate?: boolean;
}

export interface TurboVueResourceActions<T> {
  /**
   * Refetches the current key.
   */
  refetch(opts?: TurboQueryOptions): Promise<T | undefined>;

  /**
   * Mutates the current key.
   */
  mutate(value: TurboMutateValue<T>): void;

  /**
   * Usubscribes from the current key changes.
   */
  unsubscribe(): void;

  /**
   * Forgets the current key from the cache.
   */
  forget(): void;

  /**
   * Aborts the current key's request if any.
   */
  abort(reason?: any): void;

  /**
   * Determines if it's refetching in the background.
   */
  isRefetching: Readonly<Ref<boolean>>;
}

export type TurboVueResource<T> = [
  /**
   * The resulting resource.
   */
  Readonly<Ref<T | undefined>>,

  /**
   * Available actions on that resource.
   */
  TurboVueResourceActions<T>
];

/**
 * Determines how a Vue key looks like.
 */
export type TurboVueKey = () => string | false | null;

/**
 * Creates a new turbo resource with the given key and options.
 */
export function useQuery<T = any>(
  key: TurboVueKey,
  options?: TurboVueOptions
): TurboVueResource<T> {
  const contextOptions = injectTurboVue();
  const turboQuery =
    options?.turbo?.query ?? contextOptions?.turbo?.query ?? query;
  const turboMutate =
    options?.turbo?.mutate ?? contextOptions?.turbo?.mutate ?? mutate;
  const turboSubscribe =
    options?.turbo?.subscribe ?? contextOptions?.turbo?.subscribe ?? subscribe;
  const turboForget =
    options?.turbo?.forget ?? contextOptions?.turbo?.forget ?? forget;
  const turboAbort =
    options?.turbo?.abort ?? contextOptions?.turbo?.abort ?? abort;
  const immediate = options?.immediate ?? contextOptions?.immediate ?? true;

  const computedKey = computed(function () {
    try {
      return key();
    } catch {
      return null;
    }
  });

  const resource = ref<T | undefined>();
  const error = ref<unknown>();
  const isRefetching = ref<boolean>(false);

  /**
   * Initially resolve the key if needed.
   */
  (async () => {
    if (!computedKey.value || !immediate) return;
    resource.value = await turboQuery<T>(computedKey.value, {
      stale: true,
      ...options,
    });
  })();

  async function refetch(opts?: TurboQueryOptions): Promise<T | undefined> {
    if (!computedKey.value) return;
    return await turboQuery<T>(computedKey.value, {
      stale: false,
      ...options,
      ...opts,
    });
  }

  function localMutate(item: TurboMutateValue<T>): void {
    if (!computedKey.value) return;
    turboMutate(computedKey.value, item);
  }

  function localForget(): void {
    if (!computedKey.value) return;
    turboForget(computedKey.value);
  }

  function localAbort(reason?: any): void {
    if (!computedKey.value) return;
    turboAbort(computedKey.value, reason);
  }

  const unsubscribe = watch(
    computedKey,
    async function (key, _old, onCleanup) {
      isRefetching.value = false;
      if (!key) return;

      const unsubscribeMutate = turboSubscribe<T>(
        key,
        "mutated",
        function (item) {
          resource.value = item;
        }
      );

      const unsubscribeRefetching = turboSubscribe<T>(
        key,
        "refetching",
        function () {
          isRefetching.value = true;
        }
      );

      const unsubscribeResolved = turboSubscribe<T>(
        key,
        "resolved",
        function (item) {
          isRefetching.value = false;
          resource.value = item;
        }
      );

      const unsubscribeErrors = turboSubscribe<unknown>(
        key,
        "error",
        function (e) {
          isRefetching.value = false;
          error.value = e;
        }
      );

      resource.value = await turboQuery<T>(key, {
        stale: true,
        ...options,
      });

      onCleanup(function () {
        unsubscribeMutate();
        unsubscribeRefetching();
        unsubscribeResolved();
        unsubscribeErrors();
      });
    },
    { immediate }
  );

  // Unmount automatically if we're inside a component.
  if (getCurrentInstance()) onUnmounted(() => unsubscribe());

  return [
    resource,
    {
      refetch,
      mutate: localMutate,
      forget: localForget,
      abort: localAbort,
      unsubscribe,
      isRefetching: readonly(isRefetching),
    },
  ];
}
