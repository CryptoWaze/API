
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Exchange
 * 
 */
export type Exchange = $Result.DefaultSelection<Prisma.$ExchangePayload>
/**
 * Model HotWallet
 * 
 */
export type HotWallet = $Result.DefaultSelection<Prisma.$HotWalletPayload>
/**
 * Model Case
 * 
 */
export type Case = $Result.DefaultSelection<Prisma.$CasePayload>
/**
 * Model CaseSeedTransaction
 * 
 */
export type CaseSeedTransaction = $Result.DefaultSelection<Prisma.$CaseSeedTransactionPayload>
/**
 * Model Flow
 * 
 */
export type Flow = $Result.DefaultSelection<Prisma.$FlowPayload>
/**
 * Model FlowTransaction
 * 
 */
export type FlowTransaction = $Result.DefaultSelection<Prisma.$FlowTransactionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Blockchain: {
  BSC: 'BSC',
  ETH: 'ETH'
};

export type Blockchain = (typeof Blockchain)[keyof typeof Blockchain]


export const FlowEndpointReason: {
  EXCHANGE_HOT_WALLET: 'EXCHANGE_HOT_WALLET',
  MAX_HOPS_REACHED: 'MAX_HOPS_REACHED',
  NO_OUTGOING_ABOVE_THRESHOLD: 'NO_OUTGOING_ABOVE_THRESHOLD',
  CYCLE_DETECTED: 'CYCLE_DETECTED'
};

export type FlowEndpointReason = (typeof FlowEndpointReason)[keyof typeof FlowEndpointReason]

}

export type Blockchain = $Enums.Blockchain

export const Blockchain: typeof $Enums.Blockchain

export type FlowEndpointReason = $Enums.FlowEndpointReason

export const FlowEndpointReason: typeof $Enums.FlowEndpointReason

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exchange`: Exposes CRUD operations for the **Exchange** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exchanges
    * const exchanges = await prisma.exchange.findMany()
    * ```
    */
  get exchange(): Prisma.ExchangeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hotWallet`: Exposes CRUD operations for the **HotWallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HotWallets
    * const hotWallets = await prisma.hotWallet.findMany()
    * ```
    */
  get hotWallet(): Prisma.HotWalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.case`: Exposes CRUD operations for the **Case** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cases
    * const cases = await prisma.case.findMany()
    * ```
    */
  get case(): Prisma.CaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.caseSeedTransaction`: Exposes CRUD operations for the **CaseSeedTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CaseSeedTransactions
    * const caseSeedTransactions = await prisma.caseSeedTransaction.findMany()
    * ```
    */
  get caseSeedTransaction(): Prisma.CaseSeedTransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flow`: Exposes CRUD operations for the **Flow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Flows
    * const flows = await prisma.flow.findMany()
    * ```
    */
  get flow(): Prisma.FlowDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flowTransaction`: Exposes CRUD operations for the **FlowTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FlowTransactions
    * const flowTransactions = await prisma.flowTransaction.findMany()
    * ```
    */
  get flowTransaction(): Prisma.FlowTransactionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.2
   * Query Engine version: 94a226be1cf2967af2541cca5529f0f7ba866919
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Exchange: 'Exchange',
    HotWallet: 'HotWallet',
    Case: 'Case',
    CaseSeedTransaction: 'CaseSeedTransaction',
    Flow: 'Flow',
    FlowTransaction: 'FlowTransaction'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "exchange" | "hotWallet" | "case" | "caseSeedTransaction" | "flow" | "flowTransaction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Exchange: {
        payload: Prisma.$ExchangePayload<ExtArgs>
        fields: Prisma.ExchangeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExchangeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExchangeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>
          }
          findFirst: {
            args: Prisma.ExchangeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExchangeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>
          }
          findMany: {
            args: Prisma.ExchangeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>[]
          }
          create: {
            args: Prisma.ExchangeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>
          }
          createMany: {
            args: Prisma.ExchangeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExchangeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>[]
          }
          delete: {
            args: Prisma.ExchangeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>
          }
          update: {
            args: Prisma.ExchangeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>
          }
          deleteMany: {
            args: Prisma.ExchangeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExchangeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExchangeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>[]
          }
          upsert: {
            args: Prisma.ExchangeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangePayload>
          }
          aggregate: {
            args: Prisma.ExchangeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExchange>
          }
          groupBy: {
            args: Prisma.ExchangeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExchangeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExchangeCountArgs<ExtArgs>
            result: $Utils.Optional<ExchangeCountAggregateOutputType> | number
          }
        }
      }
      HotWallet: {
        payload: Prisma.$HotWalletPayload<ExtArgs>
        fields: Prisma.HotWalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HotWalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HotWalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>
          }
          findFirst: {
            args: Prisma.HotWalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HotWalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>
          }
          findMany: {
            args: Prisma.HotWalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>[]
          }
          create: {
            args: Prisma.HotWalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>
          }
          createMany: {
            args: Prisma.HotWalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HotWalletCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>[]
          }
          delete: {
            args: Prisma.HotWalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>
          }
          update: {
            args: Prisma.HotWalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>
          }
          deleteMany: {
            args: Prisma.HotWalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HotWalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HotWalletUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>[]
          }
          upsert: {
            args: Prisma.HotWalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotWalletPayload>
          }
          aggregate: {
            args: Prisma.HotWalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHotWallet>
          }
          groupBy: {
            args: Prisma.HotWalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<HotWalletGroupByOutputType>[]
          }
          count: {
            args: Prisma.HotWalletCountArgs<ExtArgs>
            result: $Utils.Optional<HotWalletCountAggregateOutputType> | number
          }
        }
      }
      Case: {
        payload: Prisma.$CasePayload<ExtArgs>
        fields: Prisma.CaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findFirst: {
            args: Prisma.CaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findMany: {
            args: Prisma.CaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          create: {
            args: Prisma.CaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          createMany: {
            args: Prisma.CaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          delete: {
            args: Prisma.CaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          update: {
            args: Prisma.CaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          deleteMany: {
            args: Prisma.CaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          upsert: {
            args: Prisma.CaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          aggregate: {
            args: Prisma.CaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCase>
          }
          groupBy: {
            args: Prisma.CaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseCountArgs<ExtArgs>
            result: $Utils.Optional<CaseCountAggregateOutputType> | number
          }
        }
      }
      CaseSeedTransaction: {
        payload: Prisma.$CaseSeedTransactionPayload<ExtArgs>
        fields: Prisma.CaseSeedTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseSeedTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseSeedTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>
          }
          findFirst: {
            args: Prisma.CaseSeedTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseSeedTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>
          }
          findMany: {
            args: Prisma.CaseSeedTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>[]
          }
          create: {
            args: Prisma.CaseSeedTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>
          }
          createMany: {
            args: Prisma.CaseSeedTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseSeedTransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>[]
          }
          delete: {
            args: Prisma.CaseSeedTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>
          }
          update: {
            args: Prisma.CaseSeedTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>
          }
          deleteMany: {
            args: Prisma.CaseSeedTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseSeedTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseSeedTransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>[]
          }
          upsert: {
            args: Prisma.CaseSeedTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseSeedTransactionPayload>
          }
          aggregate: {
            args: Prisma.CaseSeedTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCaseSeedTransaction>
          }
          groupBy: {
            args: Prisma.CaseSeedTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseSeedTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseSeedTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<CaseSeedTransactionCountAggregateOutputType> | number
          }
        }
      }
      Flow: {
        payload: Prisma.$FlowPayload<ExtArgs>
        fields: Prisma.FlowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>
          }
          findFirst: {
            args: Prisma.FlowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>
          }
          findMany: {
            args: Prisma.FlowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>[]
          }
          create: {
            args: Prisma.FlowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>
          }
          createMany: {
            args: Prisma.FlowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlowCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>[]
          }
          delete: {
            args: Prisma.FlowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>
          }
          update: {
            args: Prisma.FlowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>
          }
          deleteMany: {
            args: Prisma.FlowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlowUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>[]
          }
          upsert: {
            args: Prisma.FlowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowPayload>
          }
          aggregate: {
            args: Prisma.FlowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlow>
          }
          groupBy: {
            args: Prisma.FlowGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlowGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlowCountArgs<ExtArgs>
            result: $Utils.Optional<FlowCountAggregateOutputType> | number
          }
        }
      }
      FlowTransaction: {
        payload: Prisma.$FlowTransactionPayload<ExtArgs>
        fields: Prisma.FlowTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlowTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlowTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>
          }
          findFirst: {
            args: Prisma.FlowTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlowTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>
          }
          findMany: {
            args: Prisma.FlowTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>[]
          }
          create: {
            args: Prisma.FlowTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>
          }
          createMany: {
            args: Prisma.FlowTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlowTransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>[]
          }
          delete: {
            args: Prisma.FlowTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>
          }
          update: {
            args: Prisma.FlowTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>
          }
          deleteMany: {
            args: Prisma.FlowTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlowTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlowTransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>[]
          }
          upsert: {
            args: Prisma.FlowTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowTransactionPayload>
          }
          aggregate: {
            args: Prisma.FlowTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlowTransaction>
          }
          groupBy: {
            args: Prisma.FlowTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlowTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlowTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<FlowTransactionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    exchange?: ExchangeOmit
    hotWallet?: HotWalletOmit
    case?: CaseOmit
    caseSeedTransaction?: CaseSeedTransactionOmit
    flow?: FlowOmit
    flowTransaction?: FlowTransactionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    cases: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | UserCountOutputTypeCountCasesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
  }


  /**
   * Count Type ExchangeCountOutputType
   */

  export type ExchangeCountOutputType = {
    hotWallets: number
  }

  export type ExchangeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotWallets?: boolean | ExchangeCountOutputTypeCountHotWalletsArgs
  }

  // Custom InputTypes
  /**
   * ExchangeCountOutputType without action
   */
  export type ExchangeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeCountOutputType
     */
    select?: ExchangeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExchangeCountOutputType without action
   */
  export type ExchangeCountOutputTypeCountHotWalletsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HotWalletWhereInput
  }


  /**
   * Count Type HotWalletCountOutputType
   */

  export type HotWalletCountOutputType = {
    flowsAsEndpoint: number
  }

  export type HotWalletCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flowsAsEndpoint?: boolean | HotWalletCountOutputTypeCountFlowsAsEndpointArgs
  }

  // Custom InputTypes
  /**
   * HotWalletCountOutputType without action
   */
  export type HotWalletCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWalletCountOutputType
     */
    select?: HotWalletCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HotWalletCountOutputType without action
   */
  export type HotWalletCountOutputTypeCountFlowsAsEndpointArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowWhereInput
  }


  /**
   * Count Type CaseCountOutputType
   */

  export type CaseCountOutputType = {
    seeds: number
    flows: number
  }

  export type CaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seeds?: boolean | CaseCountOutputTypeCountSeedsArgs
    flows?: boolean | CaseCountOutputTypeCountFlowsArgs
  }

  // Custom InputTypes
  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseCountOutputType
     */
    select?: CaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountSeedsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseSeedTransactionWhereInput
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountFlowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowWhereInput
  }


  /**
   * Count Type CaseSeedTransactionCountOutputType
   */

  export type CaseSeedTransactionCountOutputType = {
    flows: number
  }

  export type CaseSeedTransactionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flows?: boolean | CaseSeedTransactionCountOutputTypeCountFlowsArgs
  }

  // Custom InputTypes
  /**
   * CaseSeedTransactionCountOutputType without action
   */
  export type CaseSeedTransactionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransactionCountOutputType
     */
    select?: CaseSeedTransactionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CaseSeedTransactionCountOutputType without action
   */
  export type CaseSeedTransactionCountOutputTypeCountFlowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowWhereInput
  }


  /**
   * Count Type FlowCountOutputType
   */

  export type FlowCountOutputType = {
    transactions: number
  }

  export type FlowCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | FlowCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * FlowCountOutputType without action
   */
  export type FlowCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowCountOutputType
     */
    select?: FlowCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FlowCountOutputType without action
   */
  export type FlowCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowTransactionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    password: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cases?: boolean | User$casesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | User$casesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      cases: Prisma.$CasePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      password: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cases<T extends User$casesArgs<ExtArgs> = {}>(args?: Subset<T, User$casesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.cases
   */
  export type User$casesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    cursor?: CaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Exchange
   */

  export type AggregateExchange = {
    _count: ExchangeCountAggregateOutputType | null
    _min: ExchangeMinAggregateOutputType | null
    _max: ExchangeMaxAggregateOutputType | null
  }

  export type ExchangeMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExchangeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExchangeCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExchangeMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExchangeMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExchangeCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExchangeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exchange to aggregate.
     */
    where?: ExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exchanges to fetch.
     */
    orderBy?: ExchangeOrderByWithRelationInput | ExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exchanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Exchanges
    **/
    _count?: true | ExchangeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExchangeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExchangeMaxAggregateInputType
  }

  export type GetExchangeAggregateType<T extends ExchangeAggregateArgs> = {
        [P in keyof T & keyof AggregateExchange]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExchange[P]>
      : GetScalarType<T[P], AggregateExchange[P]>
  }




  export type ExchangeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExchangeWhereInput
    orderBy?: ExchangeOrderByWithAggregationInput | ExchangeOrderByWithAggregationInput[]
    by: ExchangeScalarFieldEnum[] | ExchangeScalarFieldEnum
    having?: ExchangeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExchangeCountAggregateInputType | true
    _min?: ExchangeMinAggregateInputType
    _max?: ExchangeMaxAggregateInputType
  }

  export type ExchangeGroupByOutputType = {
    id: string
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
    _count: ExchangeCountAggregateOutputType | null
    _min: ExchangeMinAggregateOutputType | null
    _max: ExchangeMaxAggregateOutputType | null
  }

  type GetExchangeGroupByPayload<T extends ExchangeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExchangeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExchangeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExchangeGroupByOutputType[P]>
            : GetScalarType<T[P], ExchangeGroupByOutputType[P]>
        }
      >
    >


  export type ExchangeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotWallets?: boolean | Exchange$hotWalletsArgs<ExtArgs>
    _count?: boolean | ExchangeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exchange"]>

  export type ExchangeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["exchange"]>

  export type ExchangeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["exchange"]>

  export type ExchangeSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExchangeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt" | "updatedAt", ExtArgs["result"]["exchange"]>
  export type ExchangeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotWallets?: boolean | Exchange$hotWalletsArgs<ExtArgs>
    _count?: boolean | ExchangeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExchangeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ExchangeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ExchangePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Exchange"
    objects: {
      hotWallets: Prisma.$HotWalletPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["exchange"]>
    composites: {}
  }

  type ExchangeGetPayload<S extends boolean | null | undefined | ExchangeDefaultArgs> = $Result.GetResult<Prisma.$ExchangePayload, S>

  type ExchangeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExchangeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExchangeCountAggregateInputType | true
    }

  export interface ExchangeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Exchange'], meta: { name: 'Exchange' } }
    /**
     * Find zero or one Exchange that matches the filter.
     * @param {ExchangeFindUniqueArgs} args - Arguments to find a Exchange
     * @example
     * // Get one Exchange
     * const exchange = await prisma.exchange.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExchangeFindUniqueArgs>(args: SelectSubset<T, ExchangeFindUniqueArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Exchange that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExchangeFindUniqueOrThrowArgs} args - Arguments to find a Exchange
     * @example
     * // Get one Exchange
     * const exchange = await prisma.exchange.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExchangeFindUniqueOrThrowArgs>(args: SelectSubset<T, ExchangeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exchange that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeFindFirstArgs} args - Arguments to find a Exchange
     * @example
     * // Get one Exchange
     * const exchange = await prisma.exchange.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExchangeFindFirstArgs>(args?: SelectSubset<T, ExchangeFindFirstArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exchange that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeFindFirstOrThrowArgs} args - Arguments to find a Exchange
     * @example
     * // Get one Exchange
     * const exchange = await prisma.exchange.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExchangeFindFirstOrThrowArgs>(args?: SelectSubset<T, ExchangeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Exchanges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exchanges
     * const exchanges = await prisma.exchange.findMany()
     * 
     * // Get first 10 Exchanges
     * const exchanges = await prisma.exchange.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exchangeWithIdOnly = await prisma.exchange.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExchangeFindManyArgs>(args?: SelectSubset<T, ExchangeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Exchange.
     * @param {ExchangeCreateArgs} args - Arguments to create a Exchange.
     * @example
     * // Create one Exchange
     * const Exchange = await prisma.exchange.create({
     *   data: {
     *     // ... data to create a Exchange
     *   }
     * })
     * 
     */
    create<T extends ExchangeCreateArgs>(args: SelectSubset<T, ExchangeCreateArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Exchanges.
     * @param {ExchangeCreateManyArgs} args - Arguments to create many Exchanges.
     * @example
     * // Create many Exchanges
     * const exchange = await prisma.exchange.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExchangeCreateManyArgs>(args?: SelectSubset<T, ExchangeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Exchanges and returns the data saved in the database.
     * @param {ExchangeCreateManyAndReturnArgs} args - Arguments to create many Exchanges.
     * @example
     * // Create many Exchanges
     * const exchange = await prisma.exchange.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Exchanges and only return the `id`
     * const exchangeWithIdOnly = await prisma.exchange.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExchangeCreateManyAndReturnArgs>(args?: SelectSubset<T, ExchangeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Exchange.
     * @param {ExchangeDeleteArgs} args - Arguments to delete one Exchange.
     * @example
     * // Delete one Exchange
     * const Exchange = await prisma.exchange.delete({
     *   where: {
     *     // ... filter to delete one Exchange
     *   }
     * })
     * 
     */
    delete<T extends ExchangeDeleteArgs>(args: SelectSubset<T, ExchangeDeleteArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Exchange.
     * @param {ExchangeUpdateArgs} args - Arguments to update one Exchange.
     * @example
     * // Update one Exchange
     * const exchange = await prisma.exchange.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExchangeUpdateArgs>(args: SelectSubset<T, ExchangeUpdateArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Exchanges.
     * @param {ExchangeDeleteManyArgs} args - Arguments to filter Exchanges to delete.
     * @example
     * // Delete a few Exchanges
     * const { count } = await prisma.exchange.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExchangeDeleteManyArgs>(args?: SelectSubset<T, ExchangeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exchanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Exchanges
     * const exchange = await prisma.exchange.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExchangeUpdateManyArgs>(args: SelectSubset<T, ExchangeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exchanges and returns the data updated in the database.
     * @param {ExchangeUpdateManyAndReturnArgs} args - Arguments to update many Exchanges.
     * @example
     * // Update many Exchanges
     * const exchange = await prisma.exchange.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Exchanges and only return the `id`
     * const exchangeWithIdOnly = await prisma.exchange.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExchangeUpdateManyAndReturnArgs>(args: SelectSubset<T, ExchangeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Exchange.
     * @param {ExchangeUpsertArgs} args - Arguments to update or create a Exchange.
     * @example
     * // Update or create a Exchange
     * const exchange = await prisma.exchange.upsert({
     *   create: {
     *     // ... data to create a Exchange
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Exchange we want to update
     *   }
     * })
     */
    upsert<T extends ExchangeUpsertArgs>(args: SelectSubset<T, ExchangeUpsertArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Exchanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeCountArgs} args - Arguments to filter Exchanges to count.
     * @example
     * // Count the number of Exchanges
     * const count = await prisma.exchange.count({
     *   where: {
     *     // ... the filter for the Exchanges we want to count
     *   }
     * })
    **/
    count<T extends ExchangeCountArgs>(
      args?: Subset<T, ExchangeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExchangeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Exchange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExchangeAggregateArgs>(args: Subset<T, ExchangeAggregateArgs>): Prisma.PrismaPromise<GetExchangeAggregateType<T>>

    /**
     * Group by Exchange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExchangeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExchangeGroupByArgs['orderBy'] }
        : { orderBy?: ExchangeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExchangeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExchangeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Exchange model
   */
  readonly fields: ExchangeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Exchange.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExchangeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hotWallets<T extends Exchange$hotWalletsArgs<ExtArgs> = {}>(args?: Subset<T, Exchange$hotWalletsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Exchange model
   */
  interface ExchangeFieldRefs {
    readonly id: FieldRef<"Exchange", 'String'>
    readonly name: FieldRef<"Exchange", 'String'>
    readonly slug: FieldRef<"Exchange", 'String'>
    readonly createdAt: FieldRef<"Exchange", 'DateTime'>
    readonly updatedAt: FieldRef<"Exchange", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Exchange findUnique
   */
  export type ExchangeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * Filter, which Exchange to fetch.
     */
    where: ExchangeWhereUniqueInput
  }

  /**
   * Exchange findUniqueOrThrow
   */
  export type ExchangeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * Filter, which Exchange to fetch.
     */
    where: ExchangeWhereUniqueInput
  }

  /**
   * Exchange findFirst
   */
  export type ExchangeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * Filter, which Exchange to fetch.
     */
    where?: ExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exchanges to fetch.
     */
    orderBy?: ExchangeOrderByWithRelationInput | ExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exchanges.
     */
    cursor?: ExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exchanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exchanges.
     */
    distinct?: ExchangeScalarFieldEnum | ExchangeScalarFieldEnum[]
  }

  /**
   * Exchange findFirstOrThrow
   */
  export type ExchangeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * Filter, which Exchange to fetch.
     */
    where?: ExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exchanges to fetch.
     */
    orderBy?: ExchangeOrderByWithRelationInput | ExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exchanges.
     */
    cursor?: ExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exchanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exchanges.
     */
    distinct?: ExchangeScalarFieldEnum | ExchangeScalarFieldEnum[]
  }

  /**
   * Exchange findMany
   */
  export type ExchangeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * Filter, which Exchanges to fetch.
     */
    where?: ExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exchanges to fetch.
     */
    orderBy?: ExchangeOrderByWithRelationInput | ExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Exchanges.
     */
    cursor?: ExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exchanges.
     */
    skip?: number
    distinct?: ExchangeScalarFieldEnum | ExchangeScalarFieldEnum[]
  }

  /**
   * Exchange create
   */
  export type ExchangeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * The data needed to create a Exchange.
     */
    data: XOR<ExchangeCreateInput, ExchangeUncheckedCreateInput>
  }

  /**
   * Exchange createMany
   */
  export type ExchangeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Exchanges.
     */
    data: ExchangeCreateManyInput | ExchangeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exchange createManyAndReturn
   */
  export type ExchangeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * The data used to create many Exchanges.
     */
    data: ExchangeCreateManyInput | ExchangeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exchange update
   */
  export type ExchangeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * The data needed to update a Exchange.
     */
    data: XOR<ExchangeUpdateInput, ExchangeUncheckedUpdateInput>
    /**
     * Choose, which Exchange to update.
     */
    where: ExchangeWhereUniqueInput
  }

  /**
   * Exchange updateMany
   */
  export type ExchangeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Exchanges.
     */
    data: XOR<ExchangeUpdateManyMutationInput, ExchangeUncheckedUpdateManyInput>
    /**
     * Filter which Exchanges to update
     */
    where?: ExchangeWhereInput
    /**
     * Limit how many Exchanges to update.
     */
    limit?: number
  }

  /**
   * Exchange updateManyAndReturn
   */
  export type ExchangeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * The data used to update Exchanges.
     */
    data: XOR<ExchangeUpdateManyMutationInput, ExchangeUncheckedUpdateManyInput>
    /**
     * Filter which Exchanges to update
     */
    where?: ExchangeWhereInput
    /**
     * Limit how many Exchanges to update.
     */
    limit?: number
  }

  /**
   * Exchange upsert
   */
  export type ExchangeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * The filter to search for the Exchange to update in case it exists.
     */
    where: ExchangeWhereUniqueInput
    /**
     * In case the Exchange found by the `where` argument doesn't exist, create a new Exchange with this data.
     */
    create: XOR<ExchangeCreateInput, ExchangeUncheckedCreateInput>
    /**
     * In case the Exchange was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExchangeUpdateInput, ExchangeUncheckedUpdateInput>
  }

  /**
   * Exchange delete
   */
  export type ExchangeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
    /**
     * Filter which Exchange to delete.
     */
    where: ExchangeWhereUniqueInput
  }

  /**
   * Exchange deleteMany
   */
  export type ExchangeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exchanges to delete
     */
    where?: ExchangeWhereInput
    /**
     * Limit how many Exchanges to delete.
     */
    limit?: number
  }

  /**
   * Exchange.hotWallets
   */
  export type Exchange$hotWalletsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    where?: HotWalletWhereInput
    orderBy?: HotWalletOrderByWithRelationInput | HotWalletOrderByWithRelationInput[]
    cursor?: HotWalletWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HotWalletScalarFieldEnum | HotWalletScalarFieldEnum[]
  }

  /**
   * Exchange without action
   */
  export type ExchangeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exchange
     */
    select?: ExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exchange
     */
    omit?: ExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExchangeInclude<ExtArgs> | null
  }


  /**
   * Model HotWallet
   */

  export type AggregateHotWallet = {
    _count: HotWalletCountAggregateOutputType | null
    _min: HotWalletMinAggregateOutputType | null
    _max: HotWalletMaxAggregateOutputType | null
  }

  export type HotWalletMinAggregateOutputType = {
    id: string | null
    exchangeId: string | null
    address: string | null
    blockchain: $Enums.Blockchain | null
    label: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HotWalletMaxAggregateOutputType = {
    id: string | null
    exchangeId: string | null
    address: string | null
    blockchain: $Enums.Blockchain | null
    label: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HotWalletCountAggregateOutputType = {
    id: number
    exchangeId: number
    address: number
    blockchain: number
    label: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HotWalletMinAggregateInputType = {
    id?: true
    exchangeId?: true
    address?: true
    blockchain?: true
    label?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HotWalletMaxAggregateInputType = {
    id?: true
    exchangeId?: true
    address?: true
    blockchain?: true
    label?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HotWalletCountAggregateInputType = {
    id?: true
    exchangeId?: true
    address?: true
    blockchain?: true
    label?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HotWalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HotWallet to aggregate.
     */
    where?: HotWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotWallets to fetch.
     */
    orderBy?: HotWalletOrderByWithRelationInput | HotWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HotWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HotWallets
    **/
    _count?: true | HotWalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HotWalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HotWalletMaxAggregateInputType
  }

  export type GetHotWalletAggregateType<T extends HotWalletAggregateArgs> = {
        [P in keyof T & keyof AggregateHotWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHotWallet[P]>
      : GetScalarType<T[P], AggregateHotWallet[P]>
  }




  export type HotWalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HotWalletWhereInput
    orderBy?: HotWalletOrderByWithAggregationInput | HotWalletOrderByWithAggregationInput[]
    by: HotWalletScalarFieldEnum[] | HotWalletScalarFieldEnum
    having?: HotWalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HotWalletCountAggregateInputType | true
    _min?: HotWalletMinAggregateInputType
    _max?: HotWalletMaxAggregateInputType
  }

  export type HotWalletGroupByOutputType = {
    id: string
    exchangeId: string
    address: string
    blockchain: $Enums.Blockchain
    label: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: HotWalletCountAggregateOutputType | null
    _min: HotWalletMinAggregateOutputType | null
    _max: HotWalletMaxAggregateOutputType | null
  }

  type GetHotWalletGroupByPayload<T extends HotWalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HotWalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HotWalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HotWalletGroupByOutputType[P]>
            : GetScalarType<T[P], HotWalletGroupByOutputType[P]>
        }
      >
    >


  export type HotWalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    exchangeId?: boolean
    address?: boolean
    blockchain?: boolean
    label?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    exchange?: boolean | ExchangeDefaultArgs<ExtArgs>
    flowsAsEndpoint?: boolean | HotWallet$flowsAsEndpointArgs<ExtArgs>
    _count?: boolean | HotWalletCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hotWallet"]>

  export type HotWalletSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    exchangeId?: boolean
    address?: boolean
    blockchain?: boolean
    label?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    exchange?: boolean | ExchangeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hotWallet"]>

  export type HotWalletSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    exchangeId?: boolean
    address?: boolean
    blockchain?: boolean
    label?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    exchange?: boolean | ExchangeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hotWallet"]>

  export type HotWalletSelectScalar = {
    id?: boolean
    exchangeId?: boolean
    address?: boolean
    blockchain?: boolean
    label?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HotWalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "exchangeId" | "address" | "blockchain" | "label" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["hotWallet"]>
  export type HotWalletInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exchange?: boolean | ExchangeDefaultArgs<ExtArgs>
    flowsAsEndpoint?: boolean | HotWallet$flowsAsEndpointArgs<ExtArgs>
    _count?: boolean | HotWalletCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HotWalletIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exchange?: boolean | ExchangeDefaultArgs<ExtArgs>
  }
  export type HotWalletIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exchange?: boolean | ExchangeDefaultArgs<ExtArgs>
  }

  export type $HotWalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HotWallet"
    objects: {
      exchange: Prisma.$ExchangePayload<ExtArgs>
      flowsAsEndpoint: Prisma.$FlowPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      exchangeId: string
      address: string
      blockchain: $Enums.Blockchain
      label: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hotWallet"]>
    composites: {}
  }

  type HotWalletGetPayload<S extends boolean | null | undefined | HotWalletDefaultArgs> = $Result.GetResult<Prisma.$HotWalletPayload, S>

  type HotWalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HotWalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HotWalletCountAggregateInputType | true
    }

  export interface HotWalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HotWallet'], meta: { name: 'HotWallet' } }
    /**
     * Find zero or one HotWallet that matches the filter.
     * @param {HotWalletFindUniqueArgs} args - Arguments to find a HotWallet
     * @example
     * // Get one HotWallet
     * const hotWallet = await prisma.hotWallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HotWalletFindUniqueArgs>(args: SelectSubset<T, HotWalletFindUniqueArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HotWallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HotWalletFindUniqueOrThrowArgs} args - Arguments to find a HotWallet
     * @example
     * // Get one HotWallet
     * const hotWallet = await prisma.hotWallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HotWalletFindUniqueOrThrowArgs>(args: SelectSubset<T, HotWalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HotWallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotWalletFindFirstArgs} args - Arguments to find a HotWallet
     * @example
     * // Get one HotWallet
     * const hotWallet = await prisma.hotWallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HotWalletFindFirstArgs>(args?: SelectSubset<T, HotWalletFindFirstArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HotWallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotWalletFindFirstOrThrowArgs} args - Arguments to find a HotWallet
     * @example
     * // Get one HotWallet
     * const hotWallet = await prisma.hotWallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HotWalletFindFirstOrThrowArgs>(args?: SelectSubset<T, HotWalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HotWallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotWalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HotWallets
     * const hotWallets = await prisma.hotWallet.findMany()
     * 
     * // Get first 10 HotWallets
     * const hotWallets = await prisma.hotWallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hotWalletWithIdOnly = await prisma.hotWallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HotWalletFindManyArgs>(args?: SelectSubset<T, HotWalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HotWallet.
     * @param {HotWalletCreateArgs} args - Arguments to create a HotWallet.
     * @example
     * // Create one HotWallet
     * const HotWallet = await prisma.hotWallet.create({
     *   data: {
     *     // ... data to create a HotWallet
     *   }
     * })
     * 
     */
    create<T extends HotWalletCreateArgs>(args: SelectSubset<T, HotWalletCreateArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HotWallets.
     * @param {HotWalletCreateManyArgs} args - Arguments to create many HotWallets.
     * @example
     * // Create many HotWallets
     * const hotWallet = await prisma.hotWallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HotWalletCreateManyArgs>(args?: SelectSubset<T, HotWalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HotWallets and returns the data saved in the database.
     * @param {HotWalletCreateManyAndReturnArgs} args - Arguments to create many HotWallets.
     * @example
     * // Create many HotWallets
     * const hotWallet = await prisma.hotWallet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HotWallets and only return the `id`
     * const hotWalletWithIdOnly = await prisma.hotWallet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HotWalletCreateManyAndReturnArgs>(args?: SelectSubset<T, HotWalletCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HotWallet.
     * @param {HotWalletDeleteArgs} args - Arguments to delete one HotWallet.
     * @example
     * // Delete one HotWallet
     * const HotWallet = await prisma.hotWallet.delete({
     *   where: {
     *     // ... filter to delete one HotWallet
     *   }
     * })
     * 
     */
    delete<T extends HotWalletDeleteArgs>(args: SelectSubset<T, HotWalletDeleteArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HotWallet.
     * @param {HotWalletUpdateArgs} args - Arguments to update one HotWallet.
     * @example
     * // Update one HotWallet
     * const hotWallet = await prisma.hotWallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HotWalletUpdateArgs>(args: SelectSubset<T, HotWalletUpdateArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HotWallets.
     * @param {HotWalletDeleteManyArgs} args - Arguments to filter HotWallets to delete.
     * @example
     * // Delete a few HotWallets
     * const { count } = await prisma.hotWallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HotWalletDeleteManyArgs>(args?: SelectSubset<T, HotWalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HotWallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotWalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HotWallets
     * const hotWallet = await prisma.hotWallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HotWalletUpdateManyArgs>(args: SelectSubset<T, HotWalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HotWallets and returns the data updated in the database.
     * @param {HotWalletUpdateManyAndReturnArgs} args - Arguments to update many HotWallets.
     * @example
     * // Update many HotWallets
     * const hotWallet = await prisma.hotWallet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HotWallets and only return the `id`
     * const hotWalletWithIdOnly = await prisma.hotWallet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HotWalletUpdateManyAndReturnArgs>(args: SelectSubset<T, HotWalletUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HotWallet.
     * @param {HotWalletUpsertArgs} args - Arguments to update or create a HotWallet.
     * @example
     * // Update or create a HotWallet
     * const hotWallet = await prisma.hotWallet.upsert({
     *   create: {
     *     // ... data to create a HotWallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HotWallet we want to update
     *   }
     * })
     */
    upsert<T extends HotWalletUpsertArgs>(args: SelectSubset<T, HotWalletUpsertArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HotWallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotWalletCountArgs} args - Arguments to filter HotWallets to count.
     * @example
     * // Count the number of HotWallets
     * const count = await prisma.hotWallet.count({
     *   where: {
     *     // ... the filter for the HotWallets we want to count
     *   }
     * })
    **/
    count<T extends HotWalletCountArgs>(
      args?: Subset<T, HotWalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HotWalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HotWallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotWalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HotWalletAggregateArgs>(args: Subset<T, HotWalletAggregateArgs>): Prisma.PrismaPromise<GetHotWalletAggregateType<T>>

    /**
     * Group by HotWallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotWalletGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HotWalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HotWalletGroupByArgs['orderBy'] }
        : { orderBy?: HotWalletGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HotWalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHotWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HotWallet model
   */
  readonly fields: HotWalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HotWallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HotWalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exchange<T extends ExchangeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExchangeDefaultArgs<ExtArgs>>): Prisma__ExchangeClient<$Result.GetResult<Prisma.$ExchangePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    flowsAsEndpoint<T extends HotWallet$flowsAsEndpointArgs<ExtArgs> = {}>(args?: Subset<T, HotWallet$flowsAsEndpointArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HotWallet model
   */
  interface HotWalletFieldRefs {
    readonly id: FieldRef<"HotWallet", 'String'>
    readonly exchangeId: FieldRef<"HotWallet", 'String'>
    readonly address: FieldRef<"HotWallet", 'String'>
    readonly blockchain: FieldRef<"HotWallet", 'Blockchain'>
    readonly label: FieldRef<"HotWallet", 'String'>
    readonly isActive: FieldRef<"HotWallet", 'Boolean'>
    readonly createdAt: FieldRef<"HotWallet", 'DateTime'>
    readonly updatedAt: FieldRef<"HotWallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HotWallet findUnique
   */
  export type HotWalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * Filter, which HotWallet to fetch.
     */
    where: HotWalletWhereUniqueInput
  }

  /**
   * HotWallet findUniqueOrThrow
   */
  export type HotWalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * Filter, which HotWallet to fetch.
     */
    where: HotWalletWhereUniqueInput
  }

  /**
   * HotWallet findFirst
   */
  export type HotWalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * Filter, which HotWallet to fetch.
     */
    where?: HotWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotWallets to fetch.
     */
    orderBy?: HotWalletOrderByWithRelationInput | HotWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HotWallets.
     */
    cursor?: HotWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HotWallets.
     */
    distinct?: HotWalletScalarFieldEnum | HotWalletScalarFieldEnum[]
  }

  /**
   * HotWallet findFirstOrThrow
   */
  export type HotWalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * Filter, which HotWallet to fetch.
     */
    where?: HotWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotWallets to fetch.
     */
    orderBy?: HotWalletOrderByWithRelationInput | HotWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HotWallets.
     */
    cursor?: HotWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HotWallets.
     */
    distinct?: HotWalletScalarFieldEnum | HotWalletScalarFieldEnum[]
  }

  /**
   * HotWallet findMany
   */
  export type HotWalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * Filter, which HotWallets to fetch.
     */
    where?: HotWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotWallets to fetch.
     */
    orderBy?: HotWalletOrderByWithRelationInput | HotWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HotWallets.
     */
    cursor?: HotWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotWallets.
     */
    skip?: number
    distinct?: HotWalletScalarFieldEnum | HotWalletScalarFieldEnum[]
  }

  /**
   * HotWallet create
   */
  export type HotWalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * The data needed to create a HotWallet.
     */
    data: XOR<HotWalletCreateInput, HotWalletUncheckedCreateInput>
  }

  /**
   * HotWallet createMany
   */
  export type HotWalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HotWallets.
     */
    data: HotWalletCreateManyInput | HotWalletCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HotWallet createManyAndReturn
   */
  export type HotWalletCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * The data used to create many HotWallets.
     */
    data: HotWalletCreateManyInput | HotWalletCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HotWallet update
   */
  export type HotWalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * The data needed to update a HotWallet.
     */
    data: XOR<HotWalletUpdateInput, HotWalletUncheckedUpdateInput>
    /**
     * Choose, which HotWallet to update.
     */
    where: HotWalletWhereUniqueInput
  }

  /**
   * HotWallet updateMany
   */
  export type HotWalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HotWallets.
     */
    data: XOR<HotWalletUpdateManyMutationInput, HotWalletUncheckedUpdateManyInput>
    /**
     * Filter which HotWallets to update
     */
    where?: HotWalletWhereInput
    /**
     * Limit how many HotWallets to update.
     */
    limit?: number
  }

  /**
   * HotWallet updateManyAndReturn
   */
  export type HotWalletUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * The data used to update HotWallets.
     */
    data: XOR<HotWalletUpdateManyMutationInput, HotWalletUncheckedUpdateManyInput>
    /**
     * Filter which HotWallets to update
     */
    where?: HotWalletWhereInput
    /**
     * Limit how many HotWallets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HotWallet upsert
   */
  export type HotWalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * The filter to search for the HotWallet to update in case it exists.
     */
    where: HotWalletWhereUniqueInput
    /**
     * In case the HotWallet found by the `where` argument doesn't exist, create a new HotWallet with this data.
     */
    create: XOR<HotWalletCreateInput, HotWalletUncheckedCreateInput>
    /**
     * In case the HotWallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HotWalletUpdateInput, HotWalletUncheckedUpdateInput>
  }

  /**
   * HotWallet delete
   */
  export type HotWalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    /**
     * Filter which HotWallet to delete.
     */
    where: HotWalletWhereUniqueInput
  }

  /**
   * HotWallet deleteMany
   */
  export type HotWalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HotWallets to delete
     */
    where?: HotWalletWhereInput
    /**
     * Limit how many HotWallets to delete.
     */
    limit?: number
  }

  /**
   * HotWallet.flowsAsEndpoint
   */
  export type HotWallet$flowsAsEndpointArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    where?: FlowWhereInput
    orderBy?: FlowOrderByWithRelationInput | FlowOrderByWithRelationInput[]
    cursor?: FlowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlowScalarFieldEnum | FlowScalarFieldEnum[]
  }

  /**
   * HotWallet without action
   */
  export type HotWalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
  }


  /**
   * Model Case
   */

  export type AggregateCase = {
    _count: CaseCountAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  export type CaseMinAggregateOutputType = {
    id: string | null
    externalId: string | null
    name: string | null
    createdByUserId: string | null
    totalAmountLostRaw: string | null
    totalAmountLostDecimal: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CaseMaxAggregateOutputType = {
    id: string | null
    externalId: string | null
    name: string | null
    createdByUserId: string | null
    totalAmountLostRaw: string | null
    totalAmountLostDecimal: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CaseCountAggregateOutputType = {
    id: number
    externalId: number
    name: number
    createdByUserId: number
    totalAmountLostRaw: number
    totalAmountLostDecimal: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CaseMinAggregateInputType = {
    id?: true
    externalId?: true
    name?: true
    createdByUserId?: true
    totalAmountLostRaw?: true
    totalAmountLostDecimal?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CaseMaxAggregateInputType = {
    id?: true
    externalId?: true
    name?: true
    createdByUserId?: true
    totalAmountLostRaw?: true
    totalAmountLostDecimal?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CaseCountAggregateInputType = {
    id?: true
    externalId?: true
    name?: true
    createdByUserId?: true
    totalAmountLostRaw?: true
    totalAmountLostDecimal?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Case to aggregate.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cases
    **/
    _count?: true | CaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseMaxAggregateInputType
  }

  export type GetCaseAggregateType<T extends CaseAggregateArgs> = {
        [P in keyof T & keyof AggregateCase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCase[P]>
      : GetScalarType<T[P], AggregateCase[P]>
  }




  export type CaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithAggregationInput | CaseOrderByWithAggregationInput[]
    by: CaseScalarFieldEnum[] | CaseScalarFieldEnum
    having?: CaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseCountAggregateInputType | true
    _min?: CaseMinAggregateInputType
    _max?: CaseMaxAggregateInputType
  }

  export type CaseGroupByOutputType = {
    id: string
    externalId: string | null
    name: string
    createdByUserId: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt: Date
    updatedAt: Date
    _count: CaseCountAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  type GetCaseGroupByPayload<T extends CaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseGroupByOutputType[P]>
            : GetScalarType<T[P], CaseGroupByOutputType[P]>
        }
      >
    >


  export type CaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    externalId?: boolean
    name?: boolean
    createdByUserId?: boolean
    totalAmountLostRaw?: boolean
    totalAmountLostDecimal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdByUser?: boolean | UserDefaultArgs<ExtArgs>
    seeds?: boolean | Case$seedsArgs<ExtArgs>
    flows?: boolean | Case$flowsArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    externalId?: boolean
    name?: boolean
    createdByUserId?: boolean
    totalAmountLostRaw?: boolean
    totalAmountLostDecimal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdByUser?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    externalId?: boolean
    name?: boolean
    createdByUserId?: boolean
    totalAmountLostRaw?: boolean
    totalAmountLostDecimal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdByUser?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectScalar = {
    id?: boolean
    externalId?: boolean
    name?: boolean
    createdByUserId?: boolean
    totalAmountLostRaw?: boolean
    totalAmountLostDecimal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "externalId" | "name" | "createdByUserId" | "totalAmountLostRaw" | "totalAmountLostDecimal" | "createdAt" | "updatedAt", ExtArgs["result"]["case"]>
  export type CaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdByUser?: boolean | UserDefaultArgs<ExtArgs>
    seeds?: boolean | Case$seedsArgs<ExtArgs>
    flows?: boolean | Case$flowsArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdByUser?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdByUser?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Case"
    objects: {
      createdByUser: Prisma.$UserPayload<ExtArgs>
      seeds: Prisma.$CaseSeedTransactionPayload<ExtArgs>[]
      flows: Prisma.$FlowPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      externalId: string | null
      name: string
      createdByUserId: string
      totalAmountLostRaw: string
      totalAmountLostDecimal: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["case"]>
    composites: {}
  }

  type CaseGetPayload<S extends boolean | null | undefined | CaseDefaultArgs> = $Result.GetResult<Prisma.$CasePayload, S>

  type CaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseCountAggregateInputType | true
    }

  export interface CaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Case'], meta: { name: 'Case' } }
    /**
     * Find zero or one Case that matches the filter.
     * @param {CaseFindUniqueArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseFindUniqueArgs>(args: SelectSubset<T, CaseFindUniqueArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Case that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseFindUniqueOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Case that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseFindFirstArgs>(args?: SelectSubset<T, CaseFindFirstArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Case that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cases
     * const cases = await prisma.case.findMany()
     * 
     * // Get first 10 Cases
     * const cases = await prisma.case.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseWithIdOnly = await prisma.case.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseFindManyArgs>(args?: SelectSubset<T, CaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Case.
     * @param {CaseCreateArgs} args - Arguments to create a Case.
     * @example
     * // Create one Case
     * const Case = await prisma.case.create({
     *   data: {
     *     // ... data to create a Case
     *   }
     * })
     * 
     */
    create<T extends CaseCreateArgs>(args: SelectSubset<T, CaseCreateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cases.
     * @param {CaseCreateManyArgs} args - Arguments to create many Cases.
     * @example
     * // Create many Cases
     * const case = await prisma.case.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseCreateManyArgs>(args?: SelectSubset<T, CaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cases and returns the data saved in the database.
     * @param {CaseCreateManyAndReturnArgs} args - Arguments to create many Cases.
     * @example
     * // Create many Cases
     * const case = await prisma.case.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cases and only return the `id`
     * const caseWithIdOnly = await prisma.case.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Case.
     * @param {CaseDeleteArgs} args - Arguments to delete one Case.
     * @example
     * // Delete one Case
     * const Case = await prisma.case.delete({
     *   where: {
     *     // ... filter to delete one Case
     *   }
     * })
     * 
     */
    delete<T extends CaseDeleteArgs>(args: SelectSubset<T, CaseDeleteArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Case.
     * @param {CaseUpdateArgs} args - Arguments to update one Case.
     * @example
     * // Update one Case
     * const case = await prisma.case.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseUpdateArgs>(args: SelectSubset<T, CaseUpdateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cases.
     * @param {CaseDeleteManyArgs} args - Arguments to filter Cases to delete.
     * @example
     * // Delete a few Cases
     * const { count } = await prisma.case.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseDeleteManyArgs>(args?: SelectSubset<T, CaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cases
     * const case = await prisma.case.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseUpdateManyArgs>(args: SelectSubset<T, CaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cases and returns the data updated in the database.
     * @param {CaseUpdateManyAndReturnArgs} args - Arguments to update many Cases.
     * @example
     * // Update many Cases
     * const case = await prisma.case.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cases and only return the `id`
     * const caseWithIdOnly = await prisma.case.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Case.
     * @param {CaseUpsertArgs} args - Arguments to update or create a Case.
     * @example
     * // Update or create a Case
     * const case = await prisma.case.upsert({
     *   create: {
     *     // ... data to create a Case
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Case we want to update
     *   }
     * })
     */
    upsert<T extends CaseUpsertArgs>(args: SelectSubset<T, CaseUpsertArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseCountArgs} args - Arguments to filter Cases to count.
     * @example
     * // Count the number of Cases
     * const count = await prisma.case.count({
     *   where: {
     *     // ... the filter for the Cases we want to count
     *   }
     * })
    **/
    count<T extends CaseCountArgs>(
      args?: Subset<T, CaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseAggregateArgs>(args: Subset<T, CaseAggregateArgs>): Prisma.PrismaPromise<GetCaseAggregateType<T>>

    /**
     * Group by Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseGroupByArgs['orderBy'] }
        : { orderBy?: CaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Case model
   */
  readonly fields: CaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Case.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdByUser<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    seeds<T extends Case$seedsArgs<ExtArgs> = {}>(args?: Subset<T, Case$seedsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    flows<T extends Case$flowsArgs<ExtArgs> = {}>(args?: Subset<T, Case$flowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Case model
   */
  interface CaseFieldRefs {
    readonly id: FieldRef<"Case", 'String'>
    readonly externalId: FieldRef<"Case", 'String'>
    readonly name: FieldRef<"Case", 'String'>
    readonly createdByUserId: FieldRef<"Case", 'String'>
    readonly totalAmountLostRaw: FieldRef<"Case", 'String'>
    readonly totalAmountLostDecimal: FieldRef<"Case", 'String'>
    readonly createdAt: FieldRef<"Case", 'DateTime'>
    readonly updatedAt: FieldRef<"Case", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Case findUnique
   */
  export type CaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findUniqueOrThrow
   */
  export type CaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findFirst
   */
  export type CaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findFirstOrThrow
   */
  export type CaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findMany
   */
  export type CaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Cases to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case create
   */
  export type CaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Case.
     */
    data: XOR<CaseCreateInput, CaseUncheckedCreateInput>
  }

  /**
   * Case createMany
   */
  export type CaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cases.
     */
    data: CaseCreateManyInput | CaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Case createManyAndReturn
   */
  export type CaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * The data used to create many Cases.
     */
    data: CaseCreateManyInput | CaseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Case update
   */
  export type CaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Case.
     */
    data: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
    /**
     * Choose, which Case to update.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case updateMany
   */
  export type CaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cases.
     */
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyInput>
    /**
     * Filter which Cases to update
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to update.
     */
    limit?: number
  }

  /**
   * Case updateManyAndReturn
   */
  export type CaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * The data used to update Cases.
     */
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyInput>
    /**
     * Filter which Cases to update
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Case upsert
   */
  export type CaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Case to update in case it exists.
     */
    where: CaseWhereUniqueInput
    /**
     * In case the Case found by the `where` argument doesn't exist, create a new Case with this data.
     */
    create: XOR<CaseCreateInput, CaseUncheckedCreateInput>
    /**
     * In case the Case was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
  }

  /**
   * Case delete
   */
  export type CaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter which Case to delete.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case deleteMany
   */
  export type CaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cases to delete
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to delete.
     */
    limit?: number
  }

  /**
   * Case.seeds
   */
  export type Case$seedsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    where?: CaseSeedTransactionWhereInput
    orderBy?: CaseSeedTransactionOrderByWithRelationInput | CaseSeedTransactionOrderByWithRelationInput[]
    cursor?: CaseSeedTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseSeedTransactionScalarFieldEnum | CaseSeedTransactionScalarFieldEnum[]
  }

  /**
   * Case.flows
   */
  export type Case$flowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    where?: FlowWhereInput
    orderBy?: FlowOrderByWithRelationInput | FlowOrderByWithRelationInput[]
    cursor?: FlowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlowScalarFieldEnum | FlowScalarFieldEnum[]
  }

  /**
   * Case without action
   */
  export type CaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
  }


  /**
   * Model CaseSeedTransaction
   */

  export type AggregateCaseSeedTransaction = {
    _count: CaseSeedTransactionCountAggregateOutputType | null
    _min: CaseSeedTransactionMinAggregateOutputType | null
    _max: CaseSeedTransactionMaxAggregateOutputType | null
  }

  export type CaseSeedTransactionMinAggregateOutputType = {
    id: string | null
    caseId: string | null
    txHash: string | null
    blockchain: $Enums.Blockchain | null
    tokenAddress: string | null
    tokenSymbol: string | null
    amountRaw: string | null
    amountDecimal: string | null
    timestamp: Date | null
    createdAt: Date | null
  }

  export type CaseSeedTransactionMaxAggregateOutputType = {
    id: string | null
    caseId: string | null
    txHash: string | null
    blockchain: $Enums.Blockchain | null
    tokenAddress: string | null
    tokenSymbol: string | null
    amountRaw: string | null
    amountDecimal: string | null
    timestamp: Date | null
    createdAt: Date | null
  }

  export type CaseSeedTransactionCountAggregateOutputType = {
    id: number
    caseId: number
    txHash: number
    blockchain: number
    tokenAddress: number
    tokenSymbol: number
    amountRaw: number
    amountDecimal: number
    timestamp: number
    createdAt: number
    _all: number
  }


  export type CaseSeedTransactionMinAggregateInputType = {
    id?: true
    caseId?: true
    txHash?: true
    blockchain?: true
    tokenAddress?: true
    tokenSymbol?: true
    amountRaw?: true
    amountDecimal?: true
    timestamp?: true
    createdAt?: true
  }

  export type CaseSeedTransactionMaxAggregateInputType = {
    id?: true
    caseId?: true
    txHash?: true
    blockchain?: true
    tokenAddress?: true
    tokenSymbol?: true
    amountRaw?: true
    amountDecimal?: true
    timestamp?: true
    createdAt?: true
  }

  export type CaseSeedTransactionCountAggregateInputType = {
    id?: true
    caseId?: true
    txHash?: true
    blockchain?: true
    tokenAddress?: true
    tokenSymbol?: true
    amountRaw?: true
    amountDecimal?: true
    timestamp?: true
    createdAt?: true
    _all?: true
  }

  export type CaseSeedTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseSeedTransaction to aggregate.
     */
    where?: CaseSeedTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseSeedTransactions to fetch.
     */
    orderBy?: CaseSeedTransactionOrderByWithRelationInput | CaseSeedTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseSeedTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseSeedTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseSeedTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CaseSeedTransactions
    **/
    _count?: true | CaseSeedTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseSeedTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseSeedTransactionMaxAggregateInputType
  }

  export type GetCaseSeedTransactionAggregateType<T extends CaseSeedTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateCaseSeedTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCaseSeedTransaction[P]>
      : GetScalarType<T[P], AggregateCaseSeedTransaction[P]>
  }




  export type CaseSeedTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseSeedTransactionWhereInput
    orderBy?: CaseSeedTransactionOrderByWithAggregationInput | CaseSeedTransactionOrderByWithAggregationInput[]
    by: CaseSeedTransactionScalarFieldEnum[] | CaseSeedTransactionScalarFieldEnum
    having?: CaseSeedTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseSeedTransactionCountAggregateInputType | true
    _min?: CaseSeedTransactionMinAggregateInputType
    _max?: CaseSeedTransactionMaxAggregateInputType
  }

  export type CaseSeedTransactionGroupByOutputType = {
    id: string
    caseId: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress: string | null
    tokenSymbol: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date
    createdAt: Date
    _count: CaseSeedTransactionCountAggregateOutputType | null
    _min: CaseSeedTransactionMinAggregateOutputType | null
    _max: CaseSeedTransactionMaxAggregateOutputType | null
  }

  type GetCaseSeedTransactionGroupByPayload<T extends CaseSeedTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseSeedTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseSeedTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseSeedTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], CaseSeedTransactionGroupByOutputType[P]>
        }
      >
    >


  export type CaseSeedTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    txHash?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    createdAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    flows?: boolean | CaseSeedTransaction$flowsArgs<ExtArgs>
    _count?: boolean | CaseSeedTransactionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseSeedTransaction"]>

  export type CaseSeedTransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    txHash?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    createdAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseSeedTransaction"]>

  export type CaseSeedTransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    txHash?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    createdAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseSeedTransaction"]>

  export type CaseSeedTransactionSelectScalar = {
    id?: boolean
    caseId?: boolean
    txHash?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    createdAt?: boolean
  }

  export type CaseSeedTransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseId" | "txHash" | "blockchain" | "tokenAddress" | "tokenSymbol" | "amountRaw" | "amountDecimal" | "timestamp" | "createdAt", ExtArgs["result"]["caseSeedTransaction"]>
  export type CaseSeedTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    flows?: boolean | CaseSeedTransaction$flowsArgs<ExtArgs>
    _count?: boolean | CaseSeedTransactionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CaseSeedTransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }
  export type CaseSeedTransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
  }

  export type $CaseSeedTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CaseSeedTransaction"
    objects: {
      case: Prisma.$CasePayload<ExtArgs>
      flows: Prisma.$FlowPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseId: string
      txHash: string
      blockchain: $Enums.Blockchain
      tokenAddress: string | null
      tokenSymbol: string | null
      amountRaw: string
      amountDecimal: string
      timestamp: Date
      createdAt: Date
    }, ExtArgs["result"]["caseSeedTransaction"]>
    composites: {}
  }

  type CaseSeedTransactionGetPayload<S extends boolean | null | undefined | CaseSeedTransactionDefaultArgs> = $Result.GetResult<Prisma.$CaseSeedTransactionPayload, S>

  type CaseSeedTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseSeedTransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseSeedTransactionCountAggregateInputType | true
    }

  export interface CaseSeedTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CaseSeedTransaction'], meta: { name: 'CaseSeedTransaction' } }
    /**
     * Find zero or one CaseSeedTransaction that matches the filter.
     * @param {CaseSeedTransactionFindUniqueArgs} args - Arguments to find a CaseSeedTransaction
     * @example
     * // Get one CaseSeedTransaction
     * const caseSeedTransaction = await prisma.caseSeedTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseSeedTransactionFindUniqueArgs>(args: SelectSubset<T, CaseSeedTransactionFindUniqueArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CaseSeedTransaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseSeedTransactionFindUniqueOrThrowArgs} args - Arguments to find a CaseSeedTransaction
     * @example
     * // Get one CaseSeedTransaction
     * const caseSeedTransaction = await prisma.caseSeedTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseSeedTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseSeedTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseSeedTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseSeedTransactionFindFirstArgs} args - Arguments to find a CaseSeedTransaction
     * @example
     * // Get one CaseSeedTransaction
     * const caseSeedTransaction = await prisma.caseSeedTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseSeedTransactionFindFirstArgs>(args?: SelectSubset<T, CaseSeedTransactionFindFirstArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseSeedTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseSeedTransactionFindFirstOrThrowArgs} args - Arguments to find a CaseSeedTransaction
     * @example
     * // Get one CaseSeedTransaction
     * const caseSeedTransaction = await prisma.caseSeedTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseSeedTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseSeedTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CaseSeedTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseSeedTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CaseSeedTransactions
     * const caseSeedTransactions = await prisma.caseSeedTransaction.findMany()
     * 
     * // Get first 10 CaseSeedTransactions
     * const caseSeedTransactions = await prisma.caseSeedTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseSeedTransactionWithIdOnly = await prisma.caseSeedTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseSeedTransactionFindManyArgs>(args?: SelectSubset<T, CaseSeedTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CaseSeedTransaction.
     * @param {CaseSeedTransactionCreateArgs} args - Arguments to create a CaseSeedTransaction.
     * @example
     * // Create one CaseSeedTransaction
     * const CaseSeedTransaction = await prisma.caseSeedTransaction.create({
     *   data: {
     *     // ... data to create a CaseSeedTransaction
     *   }
     * })
     * 
     */
    create<T extends CaseSeedTransactionCreateArgs>(args: SelectSubset<T, CaseSeedTransactionCreateArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CaseSeedTransactions.
     * @param {CaseSeedTransactionCreateManyArgs} args - Arguments to create many CaseSeedTransactions.
     * @example
     * // Create many CaseSeedTransactions
     * const caseSeedTransaction = await prisma.caseSeedTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseSeedTransactionCreateManyArgs>(args?: SelectSubset<T, CaseSeedTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CaseSeedTransactions and returns the data saved in the database.
     * @param {CaseSeedTransactionCreateManyAndReturnArgs} args - Arguments to create many CaseSeedTransactions.
     * @example
     * // Create many CaseSeedTransactions
     * const caseSeedTransaction = await prisma.caseSeedTransaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CaseSeedTransactions and only return the `id`
     * const caseSeedTransactionWithIdOnly = await prisma.caseSeedTransaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseSeedTransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseSeedTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CaseSeedTransaction.
     * @param {CaseSeedTransactionDeleteArgs} args - Arguments to delete one CaseSeedTransaction.
     * @example
     * // Delete one CaseSeedTransaction
     * const CaseSeedTransaction = await prisma.caseSeedTransaction.delete({
     *   where: {
     *     // ... filter to delete one CaseSeedTransaction
     *   }
     * })
     * 
     */
    delete<T extends CaseSeedTransactionDeleteArgs>(args: SelectSubset<T, CaseSeedTransactionDeleteArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CaseSeedTransaction.
     * @param {CaseSeedTransactionUpdateArgs} args - Arguments to update one CaseSeedTransaction.
     * @example
     * // Update one CaseSeedTransaction
     * const caseSeedTransaction = await prisma.caseSeedTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseSeedTransactionUpdateArgs>(args: SelectSubset<T, CaseSeedTransactionUpdateArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CaseSeedTransactions.
     * @param {CaseSeedTransactionDeleteManyArgs} args - Arguments to filter CaseSeedTransactions to delete.
     * @example
     * // Delete a few CaseSeedTransactions
     * const { count } = await prisma.caseSeedTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseSeedTransactionDeleteManyArgs>(args?: SelectSubset<T, CaseSeedTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseSeedTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseSeedTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CaseSeedTransactions
     * const caseSeedTransaction = await prisma.caseSeedTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseSeedTransactionUpdateManyArgs>(args: SelectSubset<T, CaseSeedTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseSeedTransactions and returns the data updated in the database.
     * @param {CaseSeedTransactionUpdateManyAndReturnArgs} args - Arguments to update many CaseSeedTransactions.
     * @example
     * // Update many CaseSeedTransactions
     * const caseSeedTransaction = await prisma.caseSeedTransaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CaseSeedTransactions and only return the `id`
     * const caseSeedTransactionWithIdOnly = await prisma.caseSeedTransaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseSeedTransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseSeedTransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CaseSeedTransaction.
     * @param {CaseSeedTransactionUpsertArgs} args - Arguments to update or create a CaseSeedTransaction.
     * @example
     * // Update or create a CaseSeedTransaction
     * const caseSeedTransaction = await prisma.caseSeedTransaction.upsert({
     *   create: {
     *     // ... data to create a CaseSeedTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CaseSeedTransaction we want to update
     *   }
     * })
     */
    upsert<T extends CaseSeedTransactionUpsertArgs>(args: SelectSubset<T, CaseSeedTransactionUpsertArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CaseSeedTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseSeedTransactionCountArgs} args - Arguments to filter CaseSeedTransactions to count.
     * @example
     * // Count the number of CaseSeedTransactions
     * const count = await prisma.caseSeedTransaction.count({
     *   where: {
     *     // ... the filter for the CaseSeedTransactions we want to count
     *   }
     * })
    **/
    count<T extends CaseSeedTransactionCountArgs>(
      args?: Subset<T, CaseSeedTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseSeedTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CaseSeedTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseSeedTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseSeedTransactionAggregateArgs>(args: Subset<T, CaseSeedTransactionAggregateArgs>): Prisma.PrismaPromise<GetCaseSeedTransactionAggregateType<T>>

    /**
     * Group by CaseSeedTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseSeedTransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseSeedTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseSeedTransactionGroupByArgs['orderBy'] }
        : { orderBy?: CaseSeedTransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseSeedTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseSeedTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CaseSeedTransaction model
   */
  readonly fields: CaseSeedTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CaseSeedTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseSeedTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends CaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseDefaultArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    flows<T extends CaseSeedTransaction$flowsArgs<ExtArgs> = {}>(args?: Subset<T, CaseSeedTransaction$flowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CaseSeedTransaction model
   */
  interface CaseSeedTransactionFieldRefs {
    readonly id: FieldRef<"CaseSeedTransaction", 'String'>
    readonly caseId: FieldRef<"CaseSeedTransaction", 'String'>
    readonly txHash: FieldRef<"CaseSeedTransaction", 'String'>
    readonly blockchain: FieldRef<"CaseSeedTransaction", 'Blockchain'>
    readonly tokenAddress: FieldRef<"CaseSeedTransaction", 'String'>
    readonly tokenSymbol: FieldRef<"CaseSeedTransaction", 'String'>
    readonly amountRaw: FieldRef<"CaseSeedTransaction", 'String'>
    readonly amountDecimal: FieldRef<"CaseSeedTransaction", 'String'>
    readonly timestamp: FieldRef<"CaseSeedTransaction", 'DateTime'>
    readonly createdAt: FieldRef<"CaseSeedTransaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CaseSeedTransaction findUnique
   */
  export type CaseSeedTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CaseSeedTransaction to fetch.
     */
    where: CaseSeedTransactionWhereUniqueInput
  }

  /**
   * CaseSeedTransaction findUniqueOrThrow
   */
  export type CaseSeedTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CaseSeedTransaction to fetch.
     */
    where: CaseSeedTransactionWhereUniqueInput
  }

  /**
   * CaseSeedTransaction findFirst
   */
  export type CaseSeedTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CaseSeedTransaction to fetch.
     */
    where?: CaseSeedTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseSeedTransactions to fetch.
     */
    orderBy?: CaseSeedTransactionOrderByWithRelationInput | CaseSeedTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseSeedTransactions.
     */
    cursor?: CaseSeedTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseSeedTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseSeedTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseSeedTransactions.
     */
    distinct?: CaseSeedTransactionScalarFieldEnum | CaseSeedTransactionScalarFieldEnum[]
  }

  /**
   * CaseSeedTransaction findFirstOrThrow
   */
  export type CaseSeedTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CaseSeedTransaction to fetch.
     */
    where?: CaseSeedTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseSeedTransactions to fetch.
     */
    orderBy?: CaseSeedTransactionOrderByWithRelationInput | CaseSeedTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseSeedTransactions.
     */
    cursor?: CaseSeedTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseSeedTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseSeedTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseSeedTransactions.
     */
    distinct?: CaseSeedTransactionScalarFieldEnum | CaseSeedTransactionScalarFieldEnum[]
  }

  /**
   * CaseSeedTransaction findMany
   */
  export type CaseSeedTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CaseSeedTransactions to fetch.
     */
    where?: CaseSeedTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseSeedTransactions to fetch.
     */
    orderBy?: CaseSeedTransactionOrderByWithRelationInput | CaseSeedTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CaseSeedTransactions.
     */
    cursor?: CaseSeedTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseSeedTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseSeedTransactions.
     */
    skip?: number
    distinct?: CaseSeedTransactionScalarFieldEnum | CaseSeedTransactionScalarFieldEnum[]
  }

  /**
   * CaseSeedTransaction create
   */
  export type CaseSeedTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a CaseSeedTransaction.
     */
    data: XOR<CaseSeedTransactionCreateInput, CaseSeedTransactionUncheckedCreateInput>
  }

  /**
   * CaseSeedTransaction createMany
   */
  export type CaseSeedTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CaseSeedTransactions.
     */
    data: CaseSeedTransactionCreateManyInput | CaseSeedTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CaseSeedTransaction createManyAndReturn
   */
  export type CaseSeedTransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * The data used to create many CaseSeedTransactions.
     */
    data: CaseSeedTransactionCreateManyInput | CaseSeedTransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseSeedTransaction update
   */
  export type CaseSeedTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a CaseSeedTransaction.
     */
    data: XOR<CaseSeedTransactionUpdateInput, CaseSeedTransactionUncheckedUpdateInput>
    /**
     * Choose, which CaseSeedTransaction to update.
     */
    where: CaseSeedTransactionWhereUniqueInput
  }

  /**
   * CaseSeedTransaction updateMany
   */
  export type CaseSeedTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CaseSeedTransactions.
     */
    data: XOR<CaseSeedTransactionUpdateManyMutationInput, CaseSeedTransactionUncheckedUpdateManyInput>
    /**
     * Filter which CaseSeedTransactions to update
     */
    where?: CaseSeedTransactionWhereInput
    /**
     * Limit how many CaseSeedTransactions to update.
     */
    limit?: number
  }

  /**
   * CaseSeedTransaction updateManyAndReturn
   */
  export type CaseSeedTransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * The data used to update CaseSeedTransactions.
     */
    data: XOR<CaseSeedTransactionUpdateManyMutationInput, CaseSeedTransactionUncheckedUpdateManyInput>
    /**
     * Filter which CaseSeedTransactions to update
     */
    where?: CaseSeedTransactionWhereInput
    /**
     * Limit how many CaseSeedTransactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseSeedTransaction upsert
   */
  export type CaseSeedTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the CaseSeedTransaction to update in case it exists.
     */
    where: CaseSeedTransactionWhereUniqueInput
    /**
     * In case the CaseSeedTransaction found by the `where` argument doesn't exist, create a new CaseSeedTransaction with this data.
     */
    create: XOR<CaseSeedTransactionCreateInput, CaseSeedTransactionUncheckedCreateInput>
    /**
     * In case the CaseSeedTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseSeedTransactionUpdateInput, CaseSeedTransactionUncheckedUpdateInput>
  }

  /**
   * CaseSeedTransaction delete
   */
  export type CaseSeedTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
    /**
     * Filter which CaseSeedTransaction to delete.
     */
    where: CaseSeedTransactionWhereUniqueInput
  }

  /**
   * CaseSeedTransaction deleteMany
   */
  export type CaseSeedTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseSeedTransactions to delete
     */
    where?: CaseSeedTransactionWhereInput
    /**
     * Limit how many CaseSeedTransactions to delete.
     */
    limit?: number
  }

  /**
   * CaseSeedTransaction.flows
   */
  export type CaseSeedTransaction$flowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    where?: FlowWhereInput
    orderBy?: FlowOrderByWithRelationInput | FlowOrderByWithRelationInput[]
    cursor?: FlowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlowScalarFieldEnum | FlowScalarFieldEnum[]
  }

  /**
   * CaseSeedTransaction without action
   */
  export type CaseSeedTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseSeedTransaction
     */
    select?: CaseSeedTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseSeedTransaction
     */
    omit?: CaseSeedTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseSeedTransactionInclude<ExtArgs> | null
  }


  /**
   * Model Flow
   */

  export type AggregateFlow = {
    _count: FlowCountAggregateOutputType | null
    _avg: FlowAvgAggregateOutputType | null
    _sum: FlowSumAggregateOutputType | null
    _min: FlowMinAggregateOutputType | null
    _max: FlowMaxAggregateOutputType | null
  }

  export type FlowAvgAggregateOutputType = {
    hopsCount: number | null
  }

  export type FlowSumAggregateOutputType = {
    hopsCount: number | null
  }

  export type FlowMinAggregateOutputType = {
    id: string | null
    caseId: string | null
    seedId: string | null
    blockchain: $Enums.Blockchain | null
    tokenAddress: string | null
    tokenSymbol: string | null
    totalAmountRaw: string | null
    totalAmountDecimal: string | null
    hopsCount: number | null
    endpointAddress: string | null
    endpointReason: $Enums.FlowEndpointReason | null
    endpointHotWalletId: string | null
    isEndpointExchange: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FlowMaxAggregateOutputType = {
    id: string | null
    caseId: string | null
    seedId: string | null
    blockchain: $Enums.Blockchain | null
    tokenAddress: string | null
    tokenSymbol: string | null
    totalAmountRaw: string | null
    totalAmountDecimal: string | null
    hopsCount: number | null
    endpointAddress: string | null
    endpointReason: $Enums.FlowEndpointReason | null
    endpointHotWalletId: string | null
    isEndpointExchange: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FlowCountAggregateOutputType = {
    id: number
    caseId: number
    seedId: number
    blockchain: number
    tokenAddress: number
    tokenSymbol: number
    totalAmountRaw: number
    totalAmountDecimal: number
    hopsCount: number
    endpointAddress: number
    endpointReason: number
    endpointHotWalletId: number
    isEndpointExchange: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FlowAvgAggregateInputType = {
    hopsCount?: true
  }

  export type FlowSumAggregateInputType = {
    hopsCount?: true
  }

  export type FlowMinAggregateInputType = {
    id?: true
    caseId?: true
    seedId?: true
    blockchain?: true
    tokenAddress?: true
    tokenSymbol?: true
    totalAmountRaw?: true
    totalAmountDecimal?: true
    hopsCount?: true
    endpointAddress?: true
    endpointReason?: true
    endpointHotWalletId?: true
    isEndpointExchange?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FlowMaxAggregateInputType = {
    id?: true
    caseId?: true
    seedId?: true
    blockchain?: true
    tokenAddress?: true
    tokenSymbol?: true
    totalAmountRaw?: true
    totalAmountDecimal?: true
    hopsCount?: true
    endpointAddress?: true
    endpointReason?: true
    endpointHotWalletId?: true
    isEndpointExchange?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FlowCountAggregateInputType = {
    id?: true
    caseId?: true
    seedId?: true
    blockchain?: true
    tokenAddress?: true
    tokenSymbol?: true
    totalAmountRaw?: true
    totalAmountDecimal?: true
    hopsCount?: true
    endpointAddress?: true
    endpointReason?: true
    endpointHotWalletId?: true
    isEndpointExchange?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FlowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flow to aggregate.
     */
    where?: FlowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flows to fetch.
     */
    orderBy?: FlowOrderByWithRelationInput | FlowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Flows
    **/
    _count?: true | FlowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FlowAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FlowSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlowMaxAggregateInputType
  }

  export type GetFlowAggregateType<T extends FlowAggregateArgs> = {
        [P in keyof T & keyof AggregateFlow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlow[P]>
      : GetScalarType<T[P], AggregateFlow[P]>
  }




  export type FlowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowWhereInput
    orderBy?: FlowOrderByWithAggregationInput | FlowOrderByWithAggregationInput[]
    by: FlowScalarFieldEnum[] | FlowScalarFieldEnum
    having?: FlowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlowCountAggregateInputType | true
    _avg?: FlowAvgAggregateInputType
    _sum?: FlowSumAggregateInputType
    _min?: FlowMinAggregateInputType
    _max?: FlowMaxAggregateInputType
  }

  export type FlowGroupByOutputType = {
    id: string
    caseId: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress: string | null
    tokenSymbol: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId: string | null
    isEndpointExchange: boolean
    createdAt: Date
    updatedAt: Date
    _count: FlowCountAggregateOutputType | null
    _avg: FlowAvgAggregateOutputType | null
    _sum: FlowSumAggregateOutputType | null
    _min: FlowMinAggregateOutputType | null
    _max: FlowMaxAggregateOutputType | null
  }

  type GetFlowGroupByPayload<T extends FlowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlowGroupByOutputType[P]>
            : GetScalarType<T[P], FlowGroupByOutputType[P]>
        }
      >
    >


  export type FlowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    seedId?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    totalAmountRaw?: boolean
    totalAmountDecimal?: boolean
    hopsCount?: boolean
    endpointAddress?: boolean
    endpointReason?: boolean
    endpointHotWalletId?: boolean
    isEndpointExchange?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    seed?: boolean | CaseSeedTransactionDefaultArgs<ExtArgs>
    endpointHotWallet?: boolean | Flow$endpointHotWalletArgs<ExtArgs>
    transactions?: boolean | Flow$transactionsArgs<ExtArgs>
    _count?: boolean | FlowCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flow"]>

  export type FlowSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    seedId?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    totalAmountRaw?: boolean
    totalAmountDecimal?: boolean
    hopsCount?: boolean
    endpointAddress?: boolean
    endpointReason?: boolean
    endpointHotWalletId?: boolean
    isEndpointExchange?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    seed?: boolean | CaseSeedTransactionDefaultArgs<ExtArgs>
    endpointHotWallet?: boolean | Flow$endpointHotWalletArgs<ExtArgs>
  }, ExtArgs["result"]["flow"]>

  export type FlowSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    seedId?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    totalAmountRaw?: boolean
    totalAmountDecimal?: boolean
    hopsCount?: boolean
    endpointAddress?: boolean
    endpointReason?: boolean
    endpointHotWalletId?: boolean
    isEndpointExchange?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    seed?: boolean | CaseSeedTransactionDefaultArgs<ExtArgs>
    endpointHotWallet?: boolean | Flow$endpointHotWalletArgs<ExtArgs>
  }, ExtArgs["result"]["flow"]>

  export type FlowSelectScalar = {
    id?: boolean
    caseId?: boolean
    seedId?: boolean
    blockchain?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    totalAmountRaw?: boolean
    totalAmountDecimal?: boolean
    hopsCount?: boolean
    endpointAddress?: boolean
    endpointReason?: boolean
    endpointHotWalletId?: boolean
    isEndpointExchange?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FlowOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseId" | "seedId" | "blockchain" | "tokenAddress" | "tokenSymbol" | "totalAmountRaw" | "totalAmountDecimal" | "hopsCount" | "endpointAddress" | "endpointReason" | "endpointHotWalletId" | "isEndpointExchange" | "createdAt" | "updatedAt", ExtArgs["result"]["flow"]>
  export type FlowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    seed?: boolean | CaseSeedTransactionDefaultArgs<ExtArgs>
    endpointHotWallet?: boolean | Flow$endpointHotWalletArgs<ExtArgs>
    transactions?: boolean | Flow$transactionsArgs<ExtArgs>
    _count?: boolean | FlowCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FlowIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    seed?: boolean | CaseSeedTransactionDefaultArgs<ExtArgs>
    endpointHotWallet?: boolean | Flow$endpointHotWalletArgs<ExtArgs>
  }
  export type FlowIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    seed?: boolean | CaseSeedTransactionDefaultArgs<ExtArgs>
    endpointHotWallet?: boolean | Flow$endpointHotWalletArgs<ExtArgs>
  }

  export type $FlowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Flow"
    objects: {
      case: Prisma.$CasePayload<ExtArgs>
      seed: Prisma.$CaseSeedTransactionPayload<ExtArgs>
      endpointHotWallet: Prisma.$HotWalletPayload<ExtArgs> | null
      transactions: Prisma.$FlowTransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseId: string
      seedId: string
      blockchain: $Enums.Blockchain
      tokenAddress: string | null
      tokenSymbol: string | null
      totalAmountRaw: string
      totalAmountDecimal: string
      hopsCount: number
      endpointAddress: string
      endpointReason: $Enums.FlowEndpointReason
      endpointHotWalletId: string | null
      isEndpointExchange: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["flow"]>
    composites: {}
  }

  type FlowGetPayload<S extends boolean | null | undefined | FlowDefaultArgs> = $Result.GetResult<Prisma.$FlowPayload, S>

  type FlowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlowCountAggregateInputType | true
    }

  export interface FlowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Flow'], meta: { name: 'Flow' } }
    /**
     * Find zero or one Flow that matches the filter.
     * @param {FlowFindUniqueArgs} args - Arguments to find a Flow
     * @example
     * // Get one Flow
     * const flow = await prisma.flow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlowFindUniqueArgs>(args: SelectSubset<T, FlowFindUniqueArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Flow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlowFindUniqueOrThrowArgs} args - Arguments to find a Flow
     * @example
     * // Get one Flow
     * const flow = await prisma.flow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlowFindUniqueOrThrowArgs>(args: SelectSubset<T, FlowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowFindFirstArgs} args - Arguments to find a Flow
     * @example
     * // Get one Flow
     * const flow = await prisma.flow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlowFindFirstArgs>(args?: SelectSubset<T, FlowFindFirstArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowFindFirstOrThrowArgs} args - Arguments to find a Flow
     * @example
     * // Get one Flow
     * const flow = await prisma.flow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlowFindFirstOrThrowArgs>(args?: SelectSubset<T, FlowFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Flows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Flows
     * const flows = await prisma.flow.findMany()
     * 
     * // Get first 10 Flows
     * const flows = await prisma.flow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flowWithIdOnly = await prisma.flow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlowFindManyArgs>(args?: SelectSubset<T, FlowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Flow.
     * @param {FlowCreateArgs} args - Arguments to create a Flow.
     * @example
     * // Create one Flow
     * const Flow = await prisma.flow.create({
     *   data: {
     *     // ... data to create a Flow
     *   }
     * })
     * 
     */
    create<T extends FlowCreateArgs>(args: SelectSubset<T, FlowCreateArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Flows.
     * @param {FlowCreateManyArgs} args - Arguments to create many Flows.
     * @example
     * // Create many Flows
     * const flow = await prisma.flow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlowCreateManyArgs>(args?: SelectSubset<T, FlowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Flows and returns the data saved in the database.
     * @param {FlowCreateManyAndReturnArgs} args - Arguments to create many Flows.
     * @example
     * // Create many Flows
     * const flow = await prisma.flow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Flows and only return the `id`
     * const flowWithIdOnly = await prisma.flow.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlowCreateManyAndReturnArgs>(args?: SelectSubset<T, FlowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Flow.
     * @param {FlowDeleteArgs} args - Arguments to delete one Flow.
     * @example
     * // Delete one Flow
     * const Flow = await prisma.flow.delete({
     *   where: {
     *     // ... filter to delete one Flow
     *   }
     * })
     * 
     */
    delete<T extends FlowDeleteArgs>(args: SelectSubset<T, FlowDeleteArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Flow.
     * @param {FlowUpdateArgs} args - Arguments to update one Flow.
     * @example
     * // Update one Flow
     * const flow = await prisma.flow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlowUpdateArgs>(args: SelectSubset<T, FlowUpdateArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Flows.
     * @param {FlowDeleteManyArgs} args - Arguments to filter Flows to delete.
     * @example
     * // Delete a few Flows
     * const { count } = await prisma.flow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlowDeleteManyArgs>(args?: SelectSubset<T, FlowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Flows
     * const flow = await prisma.flow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlowUpdateManyArgs>(args: SelectSubset<T, FlowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flows and returns the data updated in the database.
     * @param {FlowUpdateManyAndReturnArgs} args - Arguments to update many Flows.
     * @example
     * // Update many Flows
     * const flow = await prisma.flow.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Flows and only return the `id`
     * const flowWithIdOnly = await prisma.flow.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlowUpdateManyAndReturnArgs>(args: SelectSubset<T, FlowUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Flow.
     * @param {FlowUpsertArgs} args - Arguments to update or create a Flow.
     * @example
     * // Update or create a Flow
     * const flow = await prisma.flow.upsert({
     *   create: {
     *     // ... data to create a Flow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Flow we want to update
     *   }
     * })
     */
    upsert<T extends FlowUpsertArgs>(args: SelectSubset<T, FlowUpsertArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Flows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowCountArgs} args - Arguments to filter Flows to count.
     * @example
     * // Count the number of Flows
     * const count = await prisma.flow.count({
     *   where: {
     *     // ... the filter for the Flows we want to count
     *   }
     * })
    **/
    count<T extends FlowCountArgs>(
      args?: Subset<T, FlowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Flow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlowAggregateArgs>(args: Subset<T, FlowAggregateArgs>): Prisma.PrismaPromise<GetFlowAggregateType<T>>

    /**
     * Group by Flow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlowGroupByArgs['orderBy'] }
        : { orderBy?: FlowGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Flow model
   */
  readonly fields: FlowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Flow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends CaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseDefaultArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    seed<T extends CaseSeedTransactionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseSeedTransactionDefaultArgs<ExtArgs>>): Prisma__CaseSeedTransactionClient<$Result.GetResult<Prisma.$CaseSeedTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    endpointHotWallet<T extends Flow$endpointHotWalletArgs<ExtArgs> = {}>(args?: Subset<T, Flow$endpointHotWalletArgs<ExtArgs>>): Prisma__HotWalletClient<$Result.GetResult<Prisma.$HotWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    transactions<T extends Flow$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Flow$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Flow model
   */
  interface FlowFieldRefs {
    readonly id: FieldRef<"Flow", 'String'>
    readonly caseId: FieldRef<"Flow", 'String'>
    readonly seedId: FieldRef<"Flow", 'String'>
    readonly blockchain: FieldRef<"Flow", 'Blockchain'>
    readonly tokenAddress: FieldRef<"Flow", 'String'>
    readonly tokenSymbol: FieldRef<"Flow", 'String'>
    readonly totalAmountRaw: FieldRef<"Flow", 'String'>
    readonly totalAmountDecimal: FieldRef<"Flow", 'String'>
    readonly hopsCount: FieldRef<"Flow", 'Int'>
    readonly endpointAddress: FieldRef<"Flow", 'String'>
    readonly endpointReason: FieldRef<"Flow", 'FlowEndpointReason'>
    readonly endpointHotWalletId: FieldRef<"Flow", 'String'>
    readonly isEndpointExchange: FieldRef<"Flow", 'Boolean'>
    readonly createdAt: FieldRef<"Flow", 'DateTime'>
    readonly updatedAt: FieldRef<"Flow", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Flow findUnique
   */
  export type FlowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * Filter, which Flow to fetch.
     */
    where: FlowWhereUniqueInput
  }

  /**
   * Flow findUniqueOrThrow
   */
  export type FlowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * Filter, which Flow to fetch.
     */
    where: FlowWhereUniqueInput
  }

  /**
   * Flow findFirst
   */
  export type FlowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * Filter, which Flow to fetch.
     */
    where?: FlowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flows to fetch.
     */
    orderBy?: FlowOrderByWithRelationInput | FlowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flows.
     */
    cursor?: FlowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flows.
     */
    distinct?: FlowScalarFieldEnum | FlowScalarFieldEnum[]
  }

  /**
   * Flow findFirstOrThrow
   */
  export type FlowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * Filter, which Flow to fetch.
     */
    where?: FlowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flows to fetch.
     */
    orderBy?: FlowOrderByWithRelationInput | FlowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flows.
     */
    cursor?: FlowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flows.
     */
    distinct?: FlowScalarFieldEnum | FlowScalarFieldEnum[]
  }

  /**
   * Flow findMany
   */
  export type FlowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * Filter, which Flows to fetch.
     */
    where?: FlowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flows to fetch.
     */
    orderBy?: FlowOrderByWithRelationInput | FlowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Flows.
     */
    cursor?: FlowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flows.
     */
    skip?: number
    distinct?: FlowScalarFieldEnum | FlowScalarFieldEnum[]
  }

  /**
   * Flow create
   */
  export type FlowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * The data needed to create a Flow.
     */
    data: XOR<FlowCreateInput, FlowUncheckedCreateInput>
  }

  /**
   * Flow createMany
   */
  export type FlowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Flows.
     */
    data: FlowCreateManyInput | FlowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Flow createManyAndReturn
   */
  export type FlowCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * The data used to create many Flows.
     */
    data: FlowCreateManyInput | FlowCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flow update
   */
  export type FlowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * The data needed to update a Flow.
     */
    data: XOR<FlowUpdateInput, FlowUncheckedUpdateInput>
    /**
     * Choose, which Flow to update.
     */
    where: FlowWhereUniqueInput
  }

  /**
   * Flow updateMany
   */
  export type FlowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Flows.
     */
    data: XOR<FlowUpdateManyMutationInput, FlowUncheckedUpdateManyInput>
    /**
     * Filter which Flows to update
     */
    where?: FlowWhereInput
    /**
     * Limit how many Flows to update.
     */
    limit?: number
  }

  /**
   * Flow updateManyAndReturn
   */
  export type FlowUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * The data used to update Flows.
     */
    data: XOR<FlowUpdateManyMutationInput, FlowUncheckedUpdateManyInput>
    /**
     * Filter which Flows to update
     */
    where?: FlowWhereInput
    /**
     * Limit how many Flows to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flow upsert
   */
  export type FlowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * The filter to search for the Flow to update in case it exists.
     */
    where: FlowWhereUniqueInput
    /**
     * In case the Flow found by the `where` argument doesn't exist, create a new Flow with this data.
     */
    create: XOR<FlowCreateInput, FlowUncheckedCreateInput>
    /**
     * In case the Flow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlowUpdateInput, FlowUncheckedUpdateInput>
  }

  /**
   * Flow delete
   */
  export type FlowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
    /**
     * Filter which Flow to delete.
     */
    where: FlowWhereUniqueInput
  }

  /**
   * Flow deleteMany
   */
  export type FlowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flows to delete
     */
    where?: FlowWhereInput
    /**
     * Limit how many Flows to delete.
     */
    limit?: number
  }

  /**
   * Flow.endpointHotWallet
   */
  export type Flow$endpointHotWalletArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotWallet
     */
    select?: HotWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotWallet
     */
    omit?: HotWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotWalletInclude<ExtArgs> | null
    where?: HotWalletWhereInput
  }

  /**
   * Flow.transactions
   */
  export type Flow$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    where?: FlowTransactionWhereInput
    orderBy?: FlowTransactionOrderByWithRelationInput | FlowTransactionOrderByWithRelationInput[]
    cursor?: FlowTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlowTransactionScalarFieldEnum | FlowTransactionScalarFieldEnum[]
  }

  /**
   * Flow without action
   */
  export type FlowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flow
     */
    select?: FlowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flow
     */
    omit?: FlowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowInclude<ExtArgs> | null
  }


  /**
   * Model FlowTransaction
   */

  export type AggregateFlowTransaction = {
    _count: FlowTransactionCountAggregateOutputType | null
    _avg: FlowTransactionAvgAggregateOutputType | null
    _sum: FlowTransactionSumAggregateOutputType | null
    _min: FlowTransactionMinAggregateOutputType | null
    _max: FlowTransactionMaxAggregateOutputType | null
  }

  export type FlowTransactionAvgAggregateOutputType = {
    hopIndex: number | null
  }

  export type FlowTransactionSumAggregateOutputType = {
    hopIndex: number | null
  }

  export type FlowTransactionMinAggregateOutputType = {
    id: string | null
    flowId: string | null
    hopIndex: number | null
    txHash: string | null
    blockchain: $Enums.Blockchain | null
    fromAddress: string | null
    toAddress: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    amountRaw: string | null
    amountDecimal: string | null
    timestamp: Date | null
    isEndpointHop: boolean | null
    createdAt: Date | null
  }

  export type FlowTransactionMaxAggregateOutputType = {
    id: string | null
    flowId: string | null
    hopIndex: number | null
    txHash: string | null
    blockchain: $Enums.Blockchain | null
    fromAddress: string | null
    toAddress: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    amountRaw: string | null
    amountDecimal: string | null
    timestamp: Date | null
    isEndpointHop: boolean | null
    createdAt: Date | null
  }

  export type FlowTransactionCountAggregateOutputType = {
    id: number
    flowId: number
    hopIndex: number
    txHash: number
    blockchain: number
    fromAddress: number
    toAddress: number
    tokenAddress: number
    tokenSymbol: number
    amountRaw: number
    amountDecimal: number
    timestamp: number
    isEndpointHop: number
    createdAt: number
    _all: number
  }


  export type FlowTransactionAvgAggregateInputType = {
    hopIndex?: true
  }

  export type FlowTransactionSumAggregateInputType = {
    hopIndex?: true
  }

  export type FlowTransactionMinAggregateInputType = {
    id?: true
    flowId?: true
    hopIndex?: true
    txHash?: true
    blockchain?: true
    fromAddress?: true
    toAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    amountRaw?: true
    amountDecimal?: true
    timestamp?: true
    isEndpointHop?: true
    createdAt?: true
  }

  export type FlowTransactionMaxAggregateInputType = {
    id?: true
    flowId?: true
    hopIndex?: true
    txHash?: true
    blockchain?: true
    fromAddress?: true
    toAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    amountRaw?: true
    amountDecimal?: true
    timestamp?: true
    isEndpointHop?: true
    createdAt?: true
  }

  export type FlowTransactionCountAggregateInputType = {
    id?: true
    flowId?: true
    hopIndex?: true
    txHash?: true
    blockchain?: true
    fromAddress?: true
    toAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    amountRaw?: true
    amountDecimal?: true
    timestamp?: true
    isEndpointHop?: true
    createdAt?: true
    _all?: true
  }

  export type FlowTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlowTransaction to aggregate.
     */
    where?: FlowTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowTransactions to fetch.
     */
    orderBy?: FlowTransactionOrderByWithRelationInput | FlowTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlowTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FlowTransactions
    **/
    _count?: true | FlowTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FlowTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FlowTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlowTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlowTransactionMaxAggregateInputType
  }

  export type GetFlowTransactionAggregateType<T extends FlowTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateFlowTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlowTransaction[P]>
      : GetScalarType<T[P], AggregateFlowTransaction[P]>
  }




  export type FlowTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowTransactionWhereInput
    orderBy?: FlowTransactionOrderByWithAggregationInput | FlowTransactionOrderByWithAggregationInput[]
    by: FlowTransactionScalarFieldEnum[] | FlowTransactionScalarFieldEnum
    having?: FlowTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlowTransactionCountAggregateInputType | true
    _avg?: FlowTransactionAvgAggregateInputType
    _sum?: FlowTransactionSumAggregateInputType
    _min?: FlowTransactionMinAggregateInputType
    _max?: FlowTransactionMaxAggregateInputType
  }

  export type FlowTransactionGroupByOutputType = {
    id: string
    flowId: string
    hopIndex: number
    txHash: string
    blockchain: $Enums.Blockchain
    fromAddress: string
    toAddress: string
    tokenAddress: string | null
    tokenSymbol: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date
    isEndpointHop: boolean
    createdAt: Date
    _count: FlowTransactionCountAggregateOutputType | null
    _avg: FlowTransactionAvgAggregateOutputType | null
    _sum: FlowTransactionSumAggregateOutputType | null
    _min: FlowTransactionMinAggregateOutputType | null
    _max: FlowTransactionMaxAggregateOutputType | null
  }

  type GetFlowTransactionGroupByPayload<T extends FlowTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlowTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlowTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlowTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], FlowTransactionGroupByOutputType[P]>
        }
      >
    >


  export type FlowTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flowId?: boolean
    hopIndex?: boolean
    txHash?: boolean
    blockchain?: boolean
    fromAddress?: boolean
    toAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    isEndpointHop?: boolean
    createdAt?: boolean
    flow?: boolean | FlowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flowTransaction"]>

  export type FlowTransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flowId?: boolean
    hopIndex?: boolean
    txHash?: boolean
    blockchain?: boolean
    fromAddress?: boolean
    toAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    isEndpointHop?: boolean
    createdAt?: boolean
    flow?: boolean | FlowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flowTransaction"]>

  export type FlowTransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flowId?: boolean
    hopIndex?: boolean
    txHash?: boolean
    blockchain?: boolean
    fromAddress?: boolean
    toAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    isEndpointHop?: boolean
    createdAt?: boolean
    flow?: boolean | FlowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flowTransaction"]>

  export type FlowTransactionSelectScalar = {
    id?: boolean
    flowId?: boolean
    hopIndex?: boolean
    txHash?: boolean
    blockchain?: boolean
    fromAddress?: boolean
    toAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    amountRaw?: boolean
    amountDecimal?: boolean
    timestamp?: boolean
    isEndpointHop?: boolean
    createdAt?: boolean
  }

  export type FlowTransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "flowId" | "hopIndex" | "txHash" | "blockchain" | "fromAddress" | "toAddress" | "tokenAddress" | "tokenSymbol" | "amountRaw" | "amountDecimal" | "timestamp" | "isEndpointHop" | "createdAt", ExtArgs["result"]["flowTransaction"]>
  export type FlowTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flow?: boolean | FlowDefaultArgs<ExtArgs>
  }
  export type FlowTransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flow?: boolean | FlowDefaultArgs<ExtArgs>
  }
  export type FlowTransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flow?: boolean | FlowDefaultArgs<ExtArgs>
  }

  export type $FlowTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FlowTransaction"
    objects: {
      flow: Prisma.$FlowPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      flowId: string
      hopIndex: number
      txHash: string
      blockchain: $Enums.Blockchain
      fromAddress: string
      toAddress: string
      tokenAddress: string | null
      tokenSymbol: string | null
      amountRaw: string
      amountDecimal: string
      timestamp: Date
      isEndpointHop: boolean
      createdAt: Date
    }, ExtArgs["result"]["flowTransaction"]>
    composites: {}
  }

  type FlowTransactionGetPayload<S extends boolean | null | undefined | FlowTransactionDefaultArgs> = $Result.GetResult<Prisma.$FlowTransactionPayload, S>

  type FlowTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlowTransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlowTransactionCountAggregateInputType | true
    }

  export interface FlowTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FlowTransaction'], meta: { name: 'FlowTransaction' } }
    /**
     * Find zero or one FlowTransaction that matches the filter.
     * @param {FlowTransactionFindUniqueArgs} args - Arguments to find a FlowTransaction
     * @example
     * // Get one FlowTransaction
     * const flowTransaction = await prisma.flowTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlowTransactionFindUniqueArgs>(args: SelectSubset<T, FlowTransactionFindUniqueArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FlowTransaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlowTransactionFindUniqueOrThrowArgs} args - Arguments to find a FlowTransaction
     * @example
     * // Get one FlowTransaction
     * const flowTransaction = await prisma.flowTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlowTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, FlowTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlowTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowTransactionFindFirstArgs} args - Arguments to find a FlowTransaction
     * @example
     * // Get one FlowTransaction
     * const flowTransaction = await prisma.flowTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlowTransactionFindFirstArgs>(args?: SelectSubset<T, FlowTransactionFindFirstArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlowTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowTransactionFindFirstOrThrowArgs} args - Arguments to find a FlowTransaction
     * @example
     * // Get one FlowTransaction
     * const flowTransaction = await prisma.flowTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlowTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, FlowTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FlowTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FlowTransactions
     * const flowTransactions = await prisma.flowTransaction.findMany()
     * 
     * // Get first 10 FlowTransactions
     * const flowTransactions = await prisma.flowTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flowTransactionWithIdOnly = await prisma.flowTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlowTransactionFindManyArgs>(args?: SelectSubset<T, FlowTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FlowTransaction.
     * @param {FlowTransactionCreateArgs} args - Arguments to create a FlowTransaction.
     * @example
     * // Create one FlowTransaction
     * const FlowTransaction = await prisma.flowTransaction.create({
     *   data: {
     *     // ... data to create a FlowTransaction
     *   }
     * })
     * 
     */
    create<T extends FlowTransactionCreateArgs>(args: SelectSubset<T, FlowTransactionCreateArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FlowTransactions.
     * @param {FlowTransactionCreateManyArgs} args - Arguments to create many FlowTransactions.
     * @example
     * // Create many FlowTransactions
     * const flowTransaction = await prisma.flowTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlowTransactionCreateManyArgs>(args?: SelectSubset<T, FlowTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FlowTransactions and returns the data saved in the database.
     * @param {FlowTransactionCreateManyAndReturnArgs} args - Arguments to create many FlowTransactions.
     * @example
     * // Create many FlowTransactions
     * const flowTransaction = await prisma.flowTransaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FlowTransactions and only return the `id`
     * const flowTransactionWithIdOnly = await prisma.flowTransaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlowTransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, FlowTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FlowTransaction.
     * @param {FlowTransactionDeleteArgs} args - Arguments to delete one FlowTransaction.
     * @example
     * // Delete one FlowTransaction
     * const FlowTransaction = await prisma.flowTransaction.delete({
     *   where: {
     *     // ... filter to delete one FlowTransaction
     *   }
     * })
     * 
     */
    delete<T extends FlowTransactionDeleteArgs>(args: SelectSubset<T, FlowTransactionDeleteArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FlowTransaction.
     * @param {FlowTransactionUpdateArgs} args - Arguments to update one FlowTransaction.
     * @example
     * // Update one FlowTransaction
     * const flowTransaction = await prisma.flowTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlowTransactionUpdateArgs>(args: SelectSubset<T, FlowTransactionUpdateArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FlowTransactions.
     * @param {FlowTransactionDeleteManyArgs} args - Arguments to filter FlowTransactions to delete.
     * @example
     * // Delete a few FlowTransactions
     * const { count } = await prisma.flowTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlowTransactionDeleteManyArgs>(args?: SelectSubset<T, FlowTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlowTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FlowTransactions
     * const flowTransaction = await prisma.flowTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlowTransactionUpdateManyArgs>(args: SelectSubset<T, FlowTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlowTransactions and returns the data updated in the database.
     * @param {FlowTransactionUpdateManyAndReturnArgs} args - Arguments to update many FlowTransactions.
     * @example
     * // Update many FlowTransactions
     * const flowTransaction = await prisma.flowTransaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FlowTransactions and only return the `id`
     * const flowTransactionWithIdOnly = await prisma.flowTransaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlowTransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, FlowTransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FlowTransaction.
     * @param {FlowTransactionUpsertArgs} args - Arguments to update or create a FlowTransaction.
     * @example
     * // Update or create a FlowTransaction
     * const flowTransaction = await prisma.flowTransaction.upsert({
     *   create: {
     *     // ... data to create a FlowTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FlowTransaction we want to update
     *   }
     * })
     */
    upsert<T extends FlowTransactionUpsertArgs>(args: SelectSubset<T, FlowTransactionUpsertArgs<ExtArgs>>): Prisma__FlowTransactionClient<$Result.GetResult<Prisma.$FlowTransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FlowTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowTransactionCountArgs} args - Arguments to filter FlowTransactions to count.
     * @example
     * // Count the number of FlowTransactions
     * const count = await prisma.flowTransaction.count({
     *   where: {
     *     // ... the filter for the FlowTransactions we want to count
     *   }
     * })
    **/
    count<T extends FlowTransactionCountArgs>(
      args?: Subset<T, FlowTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlowTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FlowTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlowTransactionAggregateArgs>(args: Subset<T, FlowTransactionAggregateArgs>): Prisma.PrismaPromise<GetFlowTransactionAggregateType<T>>

    /**
     * Group by FlowTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowTransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlowTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlowTransactionGroupByArgs['orderBy'] }
        : { orderBy?: FlowTransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlowTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlowTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FlowTransaction model
   */
  readonly fields: FlowTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FlowTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlowTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    flow<T extends FlowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FlowDefaultArgs<ExtArgs>>): Prisma__FlowClient<$Result.GetResult<Prisma.$FlowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FlowTransaction model
   */
  interface FlowTransactionFieldRefs {
    readonly id: FieldRef<"FlowTransaction", 'String'>
    readonly flowId: FieldRef<"FlowTransaction", 'String'>
    readonly hopIndex: FieldRef<"FlowTransaction", 'Int'>
    readonly txHash: FieldRef<"FlowTransaction", 'String'>
    readonly blockchain: FieldRef<"FlowTransaction", 'Blockchain'>
    readonly fromAddress: FieldRef<"FlowTransaction", 'String'>
    readonly toAddress: FieldRef<"FlowTransaction", 'String'>
    readonly tokenAddress: FieldRef<"FlowTransaction", 'String'>
    readonly tokenSymbol: FieldRef<"FlowTransaction", 'String'>
    readonly amountRaw: FieldRef<"FlowTransaction", 'String'>
    readonly amountDecimal: FieldRef<"FlowTransaction", 'String'>
    readonly timestamp: FieldRef<"FlowTransaction", 'DateTime'>
    readonly isEndpointHop: FieldRef<"FlowTransaction", 'Boolean'>
    readonly createdAt: FieldRef<"FlowTransaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FlowTransaction findUnique
   */
  export type FlowTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * Filter, which FlowTransaction to fetch.
     */
    where: FlowTransactionWhereUniqueInput
  }

  /**
   * FlowTransaction findUniqueOrThrow
   */
  export type FlowTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * Filter, which FlowTransaction to fetch.
     */
    where: FlowTransactionWhereUniqueInput
  }

  /**
   * FlowTransaction findFirst
   */
  export type FlowTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * Filter, which FlowTransaction to fetch.
     */
    where?: FlowTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowTransactions to fetch.
     */
    orderBy?: FlowTransactionOrderByWithRelationInput | FlowTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlowTransactions.
     */
    cursor?: FlowTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlowTransactions.
     */
    distinct?: FlowTransactionScalarFieldEnum | FlowTransactionScalarFieldEnum[]
  }

  /**
   * FlowTransaction findFirstOrThrow
   */
  export type FlowTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * Filter, which FlowTransaction to fetch.
     */
    where?: FlowTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowTransactions to fetch.
     */
    orderBy?: FlowTransactionOrderByWithRelationInput | FlowTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlowTransactions.
     */
    cursor?: FlowTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlowTransactions.
     */
    distinct?: FlowTransactionScalarFieldEnum | FlowTransactionScalarFieldEnum[]
  }

  /**
   * FlowTransaction findMany
   */
  export type FlowTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * Filter, which FlowTransactions to fetch.
     */
    where?: FlowTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowTransactions to fetch.
     */
    orderBy?: FlowTransactionOrderByWithRelationInput | FlowTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FlowTransactions.
     */
    cursor?: FlowTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowTransactions.
     */
    skip?: number
    distinct?: FlowTransactionScalarFieldEnum | FlowTransactionScalarFieldEnum[]
  }

  /**
   * FlowTransaction create
   */
  export type FlowTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a FlowTransaction.
     */
    data: XOR<FlowTransactionCreateInput, FlowTransactionUncheckedCreateInput>
  }

  /**
   * FlowTransaction createMany
   */
  export type FlowTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FlowTransactions.
     */
    data: FlowTransactionCreateManyInput | FlowTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FlowTransaction createManyAndReturn
   */
  export type FlowTransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * The data used to create many FlowTransactions.
     */
    data: FlowTransactionCreateManyInput | FlowTransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FlowTransaction update
   */
  export type FlowTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a FlowTransaction.
     */
    data: XOR<FlowTransactionUpdateInput, FlowTransactionUncheckedUpdateInput>
    /**
     * Choose, which FlowTransaction to update.
     */
    where: FlowTransactionWhereUniqueInput
  }

  /**
   * FlowTransaction updateMany
   */
  export type FlowTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FlowTransactions.
     */
    data: XOR<FlowTransactionUpdateManyMutationInput, FlowTransactionUncheckedUpdateManyInput>
    /**
     * Filter which FlowTransactions to update
     */
    where?: FlowTransactionWhereInput
    /**
     * Limit how many FlowTransactions to update.
     */
    limit?: number
  }

  /**
   * FlowTransaction updateManyAndReturn
   */
  export type FlowTransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * The data used to update FlowTransactions.
     */
    data: XOR<FlowTransactionUpdateManyMutationInput, FlowTransactionUncheckedUpdateManyInput>
    /**
     * Filter which FlowTransactions to update
     */
    where?: FlowTransactionWhereInput
    /**
     * Limit how many FlowTransactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FlowTransaction upsert
   */
  export type FlowTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the FlowTransaction to update in case it exists.
     */
    where: FlowTransactionWhereUniqueInput
    /**
     * In case the FlowTransaction found by the `where` argument doesn't exist, create a new FlowTransaction with this data.
     */
    create: XOR<FlowTransactionCreateInput, FlowTransactionUncheckedCreateInput>
    /**
     * In case the FlowTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlowTransactionUpdateInput, FlowTransactionUncheckedUpdateInput>
  }

  /**
   * FlowTransaction delete
   */
  export type FlowTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
    /**
     * Filter which FlowTransaction to delete.
     */
    where: FlowTransactionWhereUniqueInput
  }

  /**
   * FlowTransaction deleteMany
   */
  export type FlowTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlowTransactions to delete
     */
    where?: FlowTransactionWhereInput
    /**
     * Limit how many FlowTransactions to delete.
     */
    limit?: number
  }

  /**
   * FlowTransaction without action
   */
  export type FlowTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowTransaction
     */
    select?: FlowTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowTransaction
     */
    omit?: FlowTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlowTransactionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ExchangeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExchangeScalarFieldEnum = (typeof ExchangeScalarFieldEnum)[keyof typeof ExchangeScalarFieldEnum]


  export const HotWalletScalarFieldEnum: {
    id: 'id',
    exchangeId: 'exchangeId',
    address: 'address',
    blockchain: 'blockchain',
    label: 'label',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HotWalletScalarFieldEnum = (typeof HotWalletScalarFieldEnum)[keyof typeof HotWalletScalarFieldEnum]


  export const CaseScalarFieldEnum: {
    id: 'id',
    externalId: 'externalId',
    name: 'name',
    createdByUserId: 'createdByUserId',
    totalAmountLostRaw: 'totalAmountLostRaw',
    totalAmountLostDecimal: 'totalAmountLostDecimal',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CaseScalarFieldEnum = (typeof CaseScalarFieldEnum)[keyof typeof CaseScalarFieldEnum]


  export const CaseSeedTransactionScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    txHash: 'txHash',
    blockchain: 'blockchain',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    amountRaw: 'amountRaw',
    amountDecimal: 'amountDecimal',
    timestamp: 'timestamp',
    createdAt: 'createdAt'
  };

  export type CaseSeedTransactionScalarFieldEnum = (typeof CaseSeedTransactionScalarFieldEnum)[keyof typeof CaseSeedTransactionScalarFieldEnum]


  export const FlowScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    seedId: 'seedId',
    blockchain: 'blockchain',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    totalAmountRaw: 'totalAmountRaw',
    totalAmountDecimal: 'totalAmountDecimal',
    hopsCount: 'hopsCount',
    endpointAddress: 'endpointAddress',
    endpointReason: 'endpointReason',
    endpointHotWalletId: 'endpointHotWalletId',
    isEndpointExchange: 'isEndpointExchange',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FlowScalarFieldEnum = (typeof FlowScalarFieldEnum)[keyof typeof FlowScalarFieldEnum]


  export const FlowTransactionScalarFieldEnum: {
    id: 'id',
    flowId: 'flowId',
    hopIndex: 'hopIndex',
    txHash: 'txHash',
    blockchain: 'blockchain',
    fromAddress: 'fromAddress',
    toAddress: 'toAddress',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    amountRaw: 'amountRaw',
    amountDecimal: 'amountDecimal',
    timestamp: 'timestamp',
    isEndpointHop: 'isEndpointHop',
    createdAt: 'createdAt'
  };

  export type FlowTransactionScalarFieldEnum = (typeof FlowTransactionScalarFieldEnum)[keyof typeof FlowTransactionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Blockchain'
   */
  export type EnumBlockchainFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Blockchain'>
    


  /**
   * Reference to a field of type 'Blockchain[]'
   */
  export type ListEnumBlockchainFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Blockchain[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'FlowEndpointReason'
   */
  export type EnumFlowEndpointReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FlowEndpointReason'>
    


  /**
   * Reference to a field of type 'FlowEndpointReason[]'
   */
  export type ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FlowEndpointReason[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    cases?: CaseListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cases?: CaseOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    cases?: CaseListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ExchangeWhereInput = {
    AND?: ExchangeWhereInput | ExchangeWhereInput[]
    OR?: ExchangeWhereInput[]
    NOT?: ExchangeWhereInput | ExchangeWhereInput[]
    id?: StringFilter<"Exchange"> | string
    name?: StringFilter<"Exchange"> | string
    slug?: StringFilter<"Exchange"> | string
    createdAt?: DateTimeFilter<"Exchange"> | Date | string
    updatedAt?: DateTimeFilter<"Exchange"> | Date | string
    hotWallets?: HotWalletListRelationFilter
  }

  export type ExchangeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hotWallets?: HotWalletOrderByRelationAggregateInput
  }

  export type ExchangeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ExchangeWhereInput | ExchangeWhereInput[]
    OR?: ExchangeWhereInput[]
    NOT?: ExchangeWhereInput | ExchangeWhereInput[]
    name?: StringFilter<"Exchange"> | string
    createdAt?: DateTimeFilter<"Exchange"> | Date | string
    updatedAt?: DateTimeFilter<"Exchange"> | Date | string
    hotWallets?: HotWalletListRelationFilter
  }, "id" | "slug">

  export type ExchangeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExchangeCountOrderByAggregateInput
    _max?: ExchangeMaxOrderByAggregateInput
    _min?: ExchangeMinOrderByAggregateInput
  }

  export type ExchangeScalarWhereWithAggregatesInput = {
    AND?: ExchangeScalarWhereWithAggregatesInput | ExchangeScalarWhereWithAggregatesInput[]
    OR?: ExchangeScalarWhereWithAggregatesInput[]
    NOT?: ExchangeScalarWhereWithAggregatesInput | ExchangeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Exchange"> | string
    name?: StringWithAggregatesFilter<"Exchange"> | string
    slug?: StringWithAggregatesFilter<"Exchange"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Exchange"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Exchange"> | Date | string
  }

  export type HotWalletWhereInput = {
    AND?: HotWalletWhereInput | HotWalletWhereInput[]
    OR?: HotWalletWhereInput[]
    NOT?: HotWalletWhereInput | HotWalletWhereInput[]
    id?: StringFilter<"HotWallet"> | string
    exchangeId?: StringFilter<"HotWallet"> | string
    address?: StringFilter<"HotWallet"> | string
    blockchain?: EnumBlockchainFilter<"HotWallet"> | $Enums.Blockchain
    label?: StringNullableFilter<"HotWallet"> | string | null
    isActive?: BoolFilter<"HotWallet"> | boolean
    createdAt?: DateTimeFilter<"HotWallet"> | Date | string
    updatedAt?: DateTimeFilter<"HotWallet"> | Date | string
    exchange?: XOR<ExchangeScalarRelationFilter, ExchangeWhereInput>
    flowsAsEndpoint?: FlowListRelationFilter
  }

  export type HotWalletOrderByWithRelationInput = {
    id?: SortOrder
    exchangeId?: SortOrder
    address?: SortOrder
    blockchain?: SortOrder
    label?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    exchange?: ExchangeOrderByWithRelationInput
    flowsAsEndpoint?: FlowOrderByRelationAggregateInput
  }

  export type HotWalletWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HotWalletWhereInput | HotWalletWhereInput[]
    OR?: HotWalletWhereInput[]
    NOT?: HotWalletWhereInput | HotWalletWhereInput[]
    exchangeId?: StringFilter<"HotWallet"> | string
    address?: StringFilter<"HotWallet"> | string
    blockchain?: EnumBlockchainFilter<"HotWallet"> | $Enums.Blockchain
    label?: StringNullableFilter<"HotWallet"> | string | null
    isActive?: BoolFilter<"HotWallet"> | boolean
    createdAt?: DateTimeFilter<"HotWallet"> | Date | string
    updatedAt?: DateTimeFilter<"HotWallet"> | Date | string
    exchange?: XOR<ExchangeScalarRelationFilter, ExchangeWhereInput>
    flowsAsEndpoint?: FlowListRelationFilter
  }, "id">

  export type HotWalletOrderByWithAggregationInput = {
    id?: SortOrder
    exchangeId?: SortOrder
    address?: SortOrder
    blockchain?: SortOrder
    label?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HotWalletCountOrderByAggregateInput
    _max?: HotWalletMaxOrderByAggregateInput
    _min?: HotWalletMinOrderByAggregateInput
  }

  export type HotWalletScalarWhereWithAggregatesInput = {
    AND?: HotWalletScalarWhereWithAggregatesInput | HotWalletScalarWhereWithAggregatesInput[]
    OR?: HotWalletScalarWhereWithAggregatesInput[]
    NOT?: HotWalletScalarWhereWithAggregatesInput | HotWalletScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HotWallet"> | string
    exchangeId?: StringWithAggregatesFilter<"HotWallet"> | string
    address?: StringWithAggregatesFilter<"HotWallet"> | string
    blockchain?: EnumBlockchainWithAggregatesFilter<"HotWallet"> | $Enums.Blockchain
    label?: StringNullableWithAggregatesFilter<"HotWallet"> | string | null
    isActive?: BoolWithAggregatesFilter<"HotWallet"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"HotWallet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"HotWallet"> | Date | string
  }

  export type CaseWhereInput = {
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    id?: StringFilter<"Case"> | string
    externalId?: StringNullableFilter<"Case"> | string | null
    name?: StringFilter<"Case"> | string
    createdByUserId?: StringFilter<"Case"> | string
    totalAmountLostRaw?: StringFilter<"Case"> | string
    totalAmountLostDecimal?: StringFilter<"Case"> | string
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    createdByUser?: XOR<UserScalarRelationFilter, UserWhereInput>
    seeds?: CaseSeedTransactionListRelationFilter
    flows?: FlowListRelationFilter
  }

  export type CaseOrderByWithRelationInput = {
    id?: SortOrder
    externalId?: SortOrderInput | SortOrder
    name?: SortOrder
    createdByUserId?: SortOrder
    totalAmountLostRaw?: SortOrder
    totalAmountLostDecimal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdByUser?: UserOrderByWithRelationInput
    seeds?: CaseSeedTransactionOrderByRelationAggregateInput
    flows?: FlowOrderByRelationAggregateInput
  }

  export type CaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    externalId?: string
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    name?: StringFilter<"Case"> | string
    createdByUserId?: StringFilter<"Case"> | string
    totalAmountLostRaw?: StringFilter<"Case"> | string
    totalAmountLostDecimal?: StringFilter<"Case"> | string
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    createdByUser?: XOR<UserScalarRelationFilter, UserWhereInput>
    seeds?: CaseSeedTransactionListRelationFilter
    flows?: FlowListRelationFilter
  }, "id" | "externalId">

  export type CaseOrderByWithAggregationInput = {
    id?: SortOrder
    externalId?: SortOrderInput | SortOrder
    name?: SortOrder
    createdByUserId?: SortOrder
    totalAmountLostRaw?: SortOrder
    totalAmountLostDecimal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CaseCountOrderByAggregateInput
    _max?: CaseMaxOrderByAggregateInput
    _min?: CaseMinOrderByAggregateInput
  }

  export type CaseScalarWhereWithAggregatesInput = {
    AND?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    OR?: CaseScalarWhereWithAggregatesInput[]
    NOT?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Case"> | string
    externalId?: StringNullableWithAggregatesFilter<"Case"> | string | null
    name?: StringWithAggregatesFilter<"Case"> | string
    createdByUserId?: StringWithAggregatesFilter<"Case"> | string
    totalAmountLostRaw?: StringWithAggregatesFilter<"Case"> | string
    totalAmountLostDecimal?: StringWithAggregatesFilter<"Case"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
  }

  export type CaseSeedTransactionWhereInput = {
    AND?: CaseSeedTransactionWhereInput | CaseSeedTransactionWhereInput[]
    OR?: CaseSeedTransactionWhereInput[]
    NOT?: CaseSeedTransactionWhereInput | CaseSeedTransactionWhereInput[]
    id?: StringFilter<"CaseSeedTransaction"> | string
    caseId?: StringFilter<"CaseSeedTransaction"> | string
    txHash?: StringFilter<"CaseSeedTransaction"> | string
    blockchain?: EnumBlockchainFilter<"CaseSeedTransaction"> | $Enums.Blockchain
    tokenAddress?: StringNullableFilter<"CaseSeedTransaction"> | string | null
    tokenSymbol?: StringNullableFilter<"CaseSeedTransaction"> | string | null
    amountRaw?: StringFilter<"CaseSeedTransaction"> | string
    amountDecimal?: StringFilter<"CaseSeedTransaction"> | string
    timestamp?: DateTimeFilter<"CaseSeedTransaction"> | Date | string
    createdAt?: DateTimeFilter<"CaseSeedTransaction"> | Date | string
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    flows?: FlowListRelationFilter
  }

  export type CaseSeedTransactionOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    case?: CaseOrderByWithRelationInput
    flows?: FlowOrderByRelationAggregateInput
  }

  export type CaseSeedTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CaseSeedTransactionWhereInput | CaseSeedTransactionWhereInput[]
    OR?: CaseSeedTransactionWhereInput[]
    NOT?: CaseSeedTransactionWhereInput | CaseSeedTransactionWhereInput[]
    caseId?: StringFilter<"CaseSeedTransaction"> | string
    txHash?: StringFilter<"CaseSeedTransaction"> | string
    blockchain?: EnumBlockchainFilter<"CaseSeedTransaction"> | $Enums.Blockchain
    tokenAddress?: StringNullableFilter<"CaseSeedTransaction"> | string | null
    tokenSymbol?: StringNullableFilter<"CaseSeedTransaction"> | string | null
    amountRaw?: StringFilter<"CaseSeedTransaction"> | string
    amountDecimal?: StringFilter<"CaseSeedTransaction"> | string
    timestamp?: DateTimeFilter<"CaseSeedTransaction"> | Date | string
    createdAt?: DateTimeFilter<"CaseSeedTransaction"> | Date | string
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    flows?: FlowListRelationFilter
  }, "id">

  export type CaseSeedTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    _count?: CaseSeedTransactionCountOrderByAggregateInput
    _max?: CaseSeedTransactionMaxOrderByAggregateInput
    _min?: CaseSeedTransactionMinOrderByAggregateInput
  }

  export type CaseSeedTransactionScalarWhereWithAggregatesInput = {
    AND?: CaseSeedTransactionScalarWhereWithAggregatesInput | CaseSeedTransactionScalarWhereWithAggregatesInput[]
    OR?: CaseSeedTransactionScalarWhereWithAggregatesInput[]
    NOT?: CaseSeedTransactionScalarWhereWithAggregatesInput | CaseSeedTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CaseSeedTransaction"> | string
    caseId?: StringWithAggregatesFilter<"CaseSeedTransaction"> | string
    txHash?: StringWithAggregatesFilter<"CaseSeedTransaction"> | string
    blockchain?: EnumBlockchainWithAggregatesFilter<"CaseSeedTransaction"> | $Enums.Blockchain
    tokenAddress?: StringNullableWithAggregatesFilter<"CaseSeedTransaction"> | string | null
    tokenSymbol?: StringNullableWithAggregatesFilter<"CaseSeedTransaction"> | string | null
    amountRaw?: StringWithAggregatesFilter<"CaseSeedTransaction"> | string
    amountDecimal?: StringWithAggregatesFilter<"CaseSeedTransaction"> | string
    timestamp?: DateTimeWithAggregatesFilter<"CaseSeedTransaction"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"CaseSeedTransaction"> | Date | string
  }

  export type FlowWhereInput = {
    AND?: FlowWhereInput | FlowWhereInput[]
    OR?: FlowWhereInput[]
    NOT?: FlowWhereInput | FlowWhereInput[]
    id?: StringFilter<"Flow"> | string
    caseId?: StringFilter<"Flow"> | string
    seedId?: StringFilter<"Flow"> | string
    blockchain?: EnumBlockchainFilter<"Flow"> | $Enums.Blockchain
    tokenAddress?: StringNullableFilter<"Flow"> | string | null
    tokenSymbol?: StringNullableFilter<"Flow"> | string | null
    totalAmountRaw?: StringFilter<"Flow"> | string
    totalAmountDecimal?: StringFilter<"Flow"> | string
    hopsCount?: IntFilter<"Flow"> | number
    endpointAddress?: StringFilter<"Flow"> | string
    endpointReason?: EnumFlowEndpointReasonFilter<"Flow"> | $Enums.FlowEndpointReason
    endpointHotWalletId?: StringNullableFilter<"Flow"> | string | null
    isEndpointExchange?: BoolFilter<"Flow"> | boolean
    createdAt?: DateTimeFilter<"Flow"> | Date | string
    updatedAt?: DateTimeFilter<"Flow"> | Date | string
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    seed?: XOR<CaseSeedTransactionScalarRelationFilter, CaseSeedTransactionWhereInput>
    endpointHotWallet?: XOR<HotWalletNullableScalarRelationFilter, HotWalletWhereInput> | null
    transactions?: FlowTransactionListRelationFilter
  }

  export type FlowOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrder
    seedId?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    totalAmountRaw?: SortOrder
    totalAmountDecimal?: SortOrder
    hopsCount?: SortOrder
    endpointAddress?: SortOrder
    endpointReason?: SortOrder
    endpointHotWalletId?: SortOrderInput | SortOrder
    isEndpointExchange?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    case?: CaseOrderByWithRelationInput
    seed?: CaseSeedTransactionOrderByWithRelationInput
    endpointHotWallet?: HotWalletOrderByWithRelationInput
    transactions?: FlowTransactionOrderByRelationAggregateInput
  }

  export type FlowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlowWhereInput | FlowWhereInput[]
    OR?: FlowWhereInput[]
    NOT?: FlowWhereInput | FlowWhereInput[]
    caseId?: StringFilter<"Flow"> | string
    seedId?: StringFilter<"Flow"> | string
    blockchain?: EnumBlockchainFilter<"Flow"> | $Enums.Blockchain
    tokenAddress?: StringNullableFilter<"Flow"> | string | null
    tokenSymbol?: StringNullableFilter<"Flow"> | string | null
    totalAmountRaw?: StringFilter<"Flow"> | string
    totalAmountDecimal?: StringFilter<"Flow"> | string
    hopsCount?: IntFilter<"Flow"> | number
    endpointAddress?: StringFilter<"Flow"> | string
    endpointReason?: EnumFlowEndpointReasonFilter<"Flow"> | $Enums.FlowEndpointReason
    endpointHotWalletId?: StringNullableFilter<"Flow"> | string | null
    isEndpointExchange?: BoolFilter<"Flow"> | boolean
    createdAt?: DateTimeFilter<"Flow"> | Date | string
    updatedAt?: DateTimeFilter<"Flow"> | Date | string
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    seed?: XOR<CaseSeedTransactionScalarRelationFilter, CaseSeedTransactionWhereInput>
    endpointHotWallet?: XOR<HotWalletNullableScalarRelationFilter, HotWalletWhereInput> | null
    transactions?: FlowTransactionListRelationFilter
  }, "id">

  export type FlowOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrder
    seedId?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    totalAmountRaw?: SortOrder
    totalAmountDecimal?: SortOrder
    hopsCount?: SortOrder
    endpointAddress?: SortOrder
    endpointReason?: SortOrder
    endpointHotWalletId?: SortOrderInput | SortOrder
    isEndpointExchange?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FlowCountOrderByAggregateInput
    _avg?: FlowAvgOrderByAggregateInput
    _max?: FlowMaxOrderByAggregateInput
    _min?: FlowMinOrderByAggregateInput
    _sum?: FlowSumOrderByAggregateInput
  }

  export type FlowScalarWhereWithAggregatesInput = {
    AND?: FlowScalarWhereWithAggregatesInput | FlowScalarWhereWithAggregatesInput[]
    OR?: FlowScalarWhereWithAggregatesInput[]
    NOT?: FlowScalarWhereWithAggregatesInput | FlowScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Flow"> | string
    caseId?: StringWithAggregatesFilter<"Flow"> | string
    seedId?: StringWithAggregatesFilter<"Flow"> | string
    blockchain?: EnumBlockchainWithAggregatesFilter<"Flow"> | $Enums.Blockchain
    tokenAddress?: StringNullableWithAggregatesFilter<"Flow"> | string | null
    tokenSymbol?: StringNullableWithAggregatesFilter<"Flow"> | string | null
    totalAmountRaw?: StringWithAggregatesFilter<"Flow"> | string
    totalAmountDecimal?: StringWithAggregatesFilter<"Flow"> | string
    hopsCount?: IntWithAggregatesFilter<"Flow"> | number
    endpointAddress?: StringWithAggregatesFilter<"Flow"> | string
    endpointReason?: EnumFlowEndpointReasonWithAggregatesFilter<"Flow"> | $Enums.FlowEndpointReason
    endpointHotWalletId?: StringNullableWithAggregatesFilter<"Flow"> | string | null
    isEndpointExchange?: BoolWithAggregatesFilter<"Flow"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Flow"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Flow"> | Date | string
  }

  export type FlowTransactionWhereInput = {
    AND?: FlowTransactionWhereInput | FlowTransactionWhereInput[]
    OR?: FlowTransactionWhereInput[]
    NOT?: FlowTransactionWhereInput | FlowTransactionWhereInput[]
    id?: StringFilter<"FlowTransaction"> | string
    flowId?: StringFilter<"FlowTransaction"> | string
    hopIndex?: IntFilter<"FlowTransaction"> | number
    txHash?: StringFilter<"FlowTransaction"> | string
    blockchain?: EnumBlockchainFilter<"FlowTransaction"> | $Enums.Blockchain
    fromAddress?: StringFilter<"FlowTransaction"> | string
    toAddress?: StringFilter<"FlowTransaction"> | string
    tokenAddress?: StringNullableFilter<"FlowTransaction"> | string | null
    tokenSymbol?: StringNullableFilter<"FlowTransaction"> | string | null
    amountRaw?: StringFilter<"FlowTransaction"> | string
    amountDecimal?: StringFilter<"FlowTransaction"> | string
    timestamp?: DateTimeFilter<"FlowTransaction"> | Date | string
    isEndpointHop?: BoolFilter<"FlowTransaction"> | boolean
    createdAt?: DateTimeFilter<"FlowTransaction"> | Date | string
    flow?: XOR<FlowScalarRelationFilter, FlowWhereInput>
  }

  export type FlowTransactionOrderByWithRelationInput = {
    id?: SortOrder
    flowId?: SortOrder
    hopIndex?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    fromAddress?: SortOrder
    toAddress?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    isEndpointHop?: SortOrder
    createdAt?: SortOrder
    flow?: FlowOrderByWithRelationInput
  }

  export type FlowTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    flowId_hopIndex?: FlowTransactionFlowIdHopIndexCompoundUniqueInput
    AND?: FlowTransactionWhereInput | FlowTransactionWhereInput[]
    OR?: FlowTransactionWhereInput[]
    NOT?: FlowTransactionWhereInput | FlowTransactionWhereInput[]
    flowId?: StringFilter<"FlowTransaction"> | string
    hopIndex?: IntFilter<"FlowTransaction"> | number
    txHash?: StringFilter<"FlowTransaction"> | string
    blockchain?: EnumBlockchainFilter<"FlowTransaction"> | $Enums.Blockchain
    fromAddress?: StringFilter<"FlowTransaction"> | string
    toAddress?: StringFilter<"FlowTransaction"> | string
    tokenAddress?: StringNullableFilter<"FlowTransaction"> | string | null
    tokenSymbol?: StringNullableFilter<"FlowTransaction"> | string | null
    amountRaw?: StringFilter<"FlowTransaction"> | string
    amountDecimal?: StringFilter<"FlowTransaction"> | string
    timestamp?: DateTimeFilter<"FlowTransaction"> | Date | string
    isEndpointHop?: BoolFilter<"FlowTransaction"> | boolean
    createdAt?: DateTimeFilter<"FlowTransaction"> | Date | string
    flow?: XOR<FlowScalarRelationFilter, FlowWhereInput>
  }, "id" | "flowId_hopIndex">

  export type FlowTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    flowId?: SortOrder
    hopIndex?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    fromAddress?: SortOrder
    toAddress?: SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    isEndpointHop?: SortOrder
    createdAt?: SortOrder
    _count?: FlowTransactionCountOrderByAggregateInput
    _avg?: FlowTransactionAvgOrderByAggregateInput
    _max?: FlowTransactionMaxOrderByAggregateInput
    _min?: FlowTransactionMinOrderByAggregateInput
    _sum?: FlowTransactionSumOrderByAggregateInput
  }

  export type FlowTransactionScalarWhereWithAggregatesInput = {
    AND?: FlowTransactionScalarWhereWithAggregatesInput | FlowTransactionScalarWhereWithAggregatesInput[]
    OR?: FlowTransactionScalarWhereWithAggregatesInput[]
    NOT?: FlowTransactionScalarWhereWithAggregatesInput | FlowTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FlowTransaction"> | string
    flowId?: StringWithAggregatesFilter<"FlowTransaction"> | string
    hopIndex?: IntWithAggregatesFilter<"FlowTransaction"> | number
    txHash?: StringWithAggregatesFilter<"FlowTransaction"> | string
    blockchain?: EnumBlockchainWithAggregatesFilter<"FlowTransaction"> | $Enums.Blockchain
    fromAddress?: StringWithAggregatesFilter<"FlowTransaction"> | string
    toAddress?: StringWithAggregatesFilter<"FlowTransaction"> | string
    tokenAddress?: StringNullableWithAggregatesFilter<"FlowTransaction"> | string | null
    tokenSymbol?: StringNullableWithAggregatesFilter<"FlowTransaction"> | string | null
    amountRaw?: StringWithAggregatesFilter<"FlowTransaction"> | string
    amountDecimal?: StringWithAggregatesFilter<"FlowTransaction"> | string
    timestamp?: DateTimeWithAggregatesFilter<"FlowTransaction"> | Date | string
    isEndpointHop?: BoolWithAggregatesFilter<"FlowTransaction"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"FlowTransaction"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseCreateNestedManyWithoutCreatedByUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cases?: CaseUncheckedCreateNestedManyWithoutCreatedByUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUpdateManyWithoutCreatedByUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUncheckedUpdateManyWithoutCreatedByUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExchangeCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    hotWallets?: HotWalletCreateNestedManyWithoutExchangeInput
  }

  export type ExchangeUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    hotWallets?: HotWalletUncheckedCreateNestedManyWithoutExchangeInput
  }

  export type ExchangeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotWallets?: HotWalletUpdateManyWithoutExchangeNestedInput
  }

  export type ExchangeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotWallets?: HotWalletUncheckedUpdateManyWithoutExchangeNestedInput
  }

  export type ExchangeCreateManyInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExchangeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExchangeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotWalletCreateInput = {
    id?: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    exchange: ExchangeCreateNestedOneWithoutHotWalletsInput
    flowsAsEndpoint?: FlowCreateNestedManyWithoutEndpointHotWalletInput
  }

  export type HotWalletUncheckedCreateInput = {
    id?: string
    exchangeId: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    flowsAsEndpoint?: FlowUncheckedCreateNestedManyWithoutEndpointHotWalletInput
  }

  export type HotWalletUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exchange?: ExchangeUpdateOneRequiredWithoutHotWalletsNestedInput
    flowsAsEndpoint?: FlowUpdateManyWithoutEndpointHotWalletNestedInput
  }

  export type HotWalletUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    exchangeId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flowsAsEndpoint?: FlowUncheckedUpdateManyWithoutEndpointHotWalletNestedInput
  }

  export type HotWalletCreateManyInput = {
    id?: string
    exchangeId: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HotWalletUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotWalletUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    exchangeId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseCreateInput = {
    id?: string
    externalId?: string | null
    name: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByUser: UserCreateNestedOneWithoutCasesInput
    seeds?: CaseSeedTransactionCreateNestedManyWithoutCaseInput
    flows?: FlowCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateInput = {
    id?: string
    externalId?: string | null
    name: string
    createdByUserId: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seeds?: CaseSeedTransactionUncheckedCreateNestedManyWithoutCaseInput
    flows?: FlowUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByUser?: UserUpdateOneRequiredWithoutCasesNestedInput
    seeds?: CaseSeedTransactionUpdateManyWithoutCaseNestedInput
    flows?: FlowUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seeds?: CaseSeedTransactionUncheckedUpdateManyWithoutCaseNestedInput
    flows?: FlowUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseCreateManyInput = {
    id?: string
    externalId?: string | null
    name: string
    createdByUserId: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseSeedTransactionCreateInput = {
    id?: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
    case: CaseCreateNestedOneWithoutSeedsInput
    flows?: FlowCreateNestedManyWithoutSeedInput
  }

  export type CaseSeedTransactionUncheckedCreateInput = {
    id?: string
    caseId: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
    flows?: FlowUncheckedCreateNestedManyWithoutSeedInput
  }

  export type CaseSeedTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutSeedsNestedInput
    flows?: FlowUpdateManyWithoutSeedNestedInput
  }

  export type CaseSeedTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flows?: FlowUncheckedUpdateManyWithoutSeedNestedInput
  }

  export type CaseSeedTransactionCreateManyInput = {
    id?: string
    caseId: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type CaseSeedTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseSeedTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowCreateInput = {
    id?: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    case: CaseCreateNestedOneWithoutFlowsInput
    seed: CaseSeedTransactionCreateNestedOneWithoutFlowsInput
    endpointHotWallet?: HotWalletCreateNestedOneWithoutFlowsAsEndpointInput
    transactions?: FlowTransactionCreateNestedManyWithoutFlowInput
  }

  export type FlowUncheckedCreateInput = {
    id?: string
    caseId: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId?: string | null
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: FlowTransactionUncheckedCreateNestedManyWithoutFlowInput
  }

  export type FlowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutFlowsNestedInput
    seed?: CaseSeedTransactionUpdateOneRequiredWithoutFlowsNestedInput
    endpointHotWallet?: HotWalletUpdateOneWithoutFlowsAsEndpointNestedInput
    transactions?: FlowTransactionUpdateManyWithoutFlowNestedInput
  }

  export type FlowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    seedId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    endpointHotWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: FlowTransactionUncheckedUpdateManyWithoutFlowNestedInput
  }

  export type FlowCreateManyInput = {
    id?: string
    caseId: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId?: string | null
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    seedId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    endpointHotWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowTransactionCreateInput = {
    id?: string
    hopIndex: number
    txHash: string
    blockchain: $Enums.Blockchain
    fromAddress: string
    toAddress: string
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    isEndpointHop?: boolean
    createdAt?: Date | string
    flow: FlowCreateNestedOneWithoutTransactionsInput
  }

  export type FlowTransactionUncheckedCreateInput = {
    id?: string
    flowId: string
    hopIndex: number
    txHash: string
    blockchain: $Enums.Blockchain
    fromAddress: string
    toAddress: string
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    isEndpointHop?: boolean
    createdAt?: Date | string
  }

  export type FlowTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hopIndex?: IntFieldUpdateOperationsInput | number
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    fromAddress?: StringFieldUpdateOperationsInput | string
    toAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isEndpointHop?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flow?: FlowUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type FlowTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    flowId?: StringFieldUpdateOperationsInput | string
    hopIndex?: IntFieldUpdateOperationsInput | number
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    fromAddress?: StringFieldUpdateOperationsInput | string
    toAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isEndpointHop?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowTransactionCreateManyInput = {
    id?: string
    flowId: string
    hopIndex: number
    txHash: string
    blockchain: $Enums.Blockchain
    fromAddress: string
    toAddress: string
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    isEndpointHop?: boolean
    createdAt?: Date | string
  }

  export type FlowTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    hopIndex?: IntFieldUpdateOperationsInput | number
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    fromAddress?: StringFieldUpdateOperationsInput | string
    toAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isEndpointHop?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    flowId?: StringFieldUpdateOperationsInput | string
    hopIndex?: IntFieldUpdateOperationsInput | number
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    fromAddress?: StringFieldUpdateOperationsInput | string
    toAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isEndpointHop?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CaseListRelationFilter = {
    every?: CaseWhereInput
    some?: CaseWhereInput
    none?: CaseWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type HotWalletListRelationFilter = {
    every?: HotWalletWhereInput
    some?: HotWalletWhereInput
    none?: HotWalletWhereInput
  }

  export type HotWalletOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExchangeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExchangeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExchangeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumBlockchainFilter<$PrismaModel = never> = {
    equals?: $Enums.Blockchain | EnumBlockchainFieldRefInput<$PrismaModel>
    in?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    notIn?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    not?: NestedEnumBlockchainFilter<$PrismaModel> | $Enums.Blockchain
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ExchangeScalarRelationFilter = {
    is?: ExchangeWhereInput
    isNot?: ExchangeWhereInput
  }

  export type FlowListRelationFilter = {
    every?: FlowWhereInput
    some?: FlowWhereInput
    none?: FlowWhereInput
  }

  export type FlowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HotWalletCountOrderByAggregateInput = {
    id?: SortOrder
    exchangeId?: SortOrder
    address?: SortOrder
    blockchain?: SortOrder
    label?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HotWalletMaxOrderByAggregateInput = {
    id?: SortOrder
    exchangeId?: SortOrder
    address?: SortOrder
    blockchain?: SortOrder
    label?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HotWalletMinOrderByAggregateInput = {
    id?: SortOrder
    exchangeId?: SortOrder
    address?: SortOrder
    blockchain?: SortOrder
    label?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumBlockchainWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Blockchain | EnumBlockchainFieldRefInput<$PrismaModel>
    in?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    notIn?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    not?: NestedEnumBlockchainWithAggregatesFilter<$PrismaModel> | $Enums.Blockchain
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBlockchainFilter<$PrismaModel>
    _max?: NestedEnumBlockchainFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CaseSeedTransactionListRelationFilter = {
    every?: CaseSeedTransactionWhereInput
    some?: CaseSeedTransactionWhereInput
    none?: CaseSeedTransactionWhereInput
  }

  export type CaseSeedTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CaseCountOrderByAggregateInput = {
    id?: SortOrder
    externalId?: SortOrder
    name?: SortOrder
    createdByUserId?: SortOrder
    totalAmountLostRaw?: SortOrder
    totalAmountLostDecimal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CaseMaxOrderByAggregateInput = {
    id?: SortOrder
    externalId?: SortOrder
    name?: SortOrder
    createdByUserId?: SortOrder
    totalAmountLostRaw?: SortOrder
    totalAmountLostDecimal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CaseMinOrderByAggregateInput = {
    id?: SortOrder
    externalId?: SortOrder
    name?: SortOrder
    createdByUserId?: SortOrder
    totalAmountLostRaw?: SortOrder
    totalAmountLostDecimal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CaseScalarRelationFilter = {
    is?: CaseWhereInput
    isNot?: CaseWhereInput
  }

  export type CaseSeedTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseSeedTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseSeedTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumFlowEndpointReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.FlowEndpointReason | EnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    in?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumFlowEndpointReasonFilter<$PrismaModel> | $Enums.FlowEndpointReason
  }

  export type CaseSeedTransactionScalarRelationFilter = {
    is?: CaseSeedTransactionWhereInput
    isNot?: CaseSeedTransactionWhereInput
  }

  export type HotWalletNullableScalarRelationFilter = {
    is?: HotWalletWhereInput | null
    isNot?: HotWalletWhereInput | null
  }

  export type FlowTransactionListRelationFilter = {
    every?: FlowTransactionWhereInput
    some?: FlowTransactionWhereInput
    none?: FlowTransactionWhereInput
  }

  export type FlowTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FlowCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    seedId?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    totalAmountRaw?: SortOrder
    totalAmountDecimal?: SortOrder
    hopsCount?: SortOrder
    endpointAddress?: SortOrder
    endpointReason?: SortOrder
    endpointHotWalletId?: SortOrder
    isEndpointExchange?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FlowAvgOrderByAggregateInput = {
    hopsCount?: SortOrder
  }

  export type FlowMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    seedId?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    totalAmountRaw?: SortOrder
    totalAmountDecimal?: SortOrder
    hopsCount?: SortOrder
    endpointAddress?: SortOrder
    endpointReason?: SortOrder
    endpointHotWalletId?: SortOrder
    isEndpointExchange?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FlowMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    seedId?: SortOrder
    blockchain?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    totalAmountRaw?: SortOrder
    totalAmountDecimal?: SortOrder
    hopsCount?: SortOrder
    endpointAddress?: SortOrder
    endpointReason?: SortOrder
    endpointHotWalletId?: SortOrder
    isEndpointExchange?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FlowSumOrderByAggregateInput = {
    hopsCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumFlowEndpointReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FlowEndpointReason | EnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    in?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumFlowEndpointReasonWithAggregatesFilter<$PrismaModel> | $Enums.FlowEndpointReason
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFlowEndpointReasonFilter<$PrismaModel>
    _max?: NestedEnumFlowEndpointReasonFilter<$PrismaModel>
  }

  export type FlowScalarRelationFilter = {
    is?: FlowWhereInput
    isNot?: FlowWhereInput
  }

  export type FlowTransactionFlowIdHopIndexCompoundUniqueInput = {
    flowId: string
    hopIndex: number
  }

  export type FlowTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    flowId?: SortOrder
    hopIndex?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    fromAddress?: SortOrder
    toAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    isEndpointHop?: SortOrder
    createdAt?: SortOrder
  }

  export type FlowTransactionAvgOrderByAggregateInput = {
    hopIndex?: SortOrder
  }

  export type FlowTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    flowId?: SortOrder
    hopIndex?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    fromAddress?: SortOrder
    toAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    isEndpointHop?: SortOrder
    createdAt?: SortOrder
  }

  export type FlowTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    flowId?: SortOrder
    hopIndex?: SortOrder
    txHash?: SortOrder
    blockchain?: SortOrder
    fromAddress?: SortOrder
    toAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    amountRaw?: SortOrder
    amountDecimal?: SortOrder
    timestamp?: SortOrder
    isEndpointHop?: SortOrder
    createdAt?: SortOrder
  }

  export type FlowTransactionSumOrderByAggregateInput = {
    hopIndex?: SortOrder
  }

  export type CaseCreateNestedManyWithoutCreatedByUserInput = {
    create?: XOR<CaseCreateWithoutCreatedByUserInput, CaseUncheckedCreateWithoutCreatedByUserInput> | CaseCreateWithoutCreatedByUserInput[] | CaseUncheckedCreateWithoutCreatedByUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCreatedByUserInput | CaseCreateOrConnectWithoutCreatedByUserInput[]
    createMany?: CaseCreateManyCreatedByUserInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type CaseUncheckedCreateNestedManyWithoutCreatedByUserInput = {
    create?: XOR<CaseCreateWithoutCreatedByUserInput, CaseUncheckedCreateWithoutCreatedByUserInput> | CaseCreateWithoutCreatedByUserInput[] | CaseUncheckedCreateWithoutCreatedByUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCreatedByUserInput | CaseCreateOrConnectWithoutCreatedByUserInput[]
    createMany?: CaseCreateManyCreatedByUserInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CaseUpdateManyWithoutCreatedByUserNestedInput = {
    create?: XOR<CaseCreateWithoutCreatedByUserInput, CaseUncheckedCreateWithoutCreatedByUserInput> | CaseCreateWithoutCreatedByUserInput[] | CaseUncheckedCreateWithoutCreatedByUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCreatedByUserInput | CaseCreateOrConnectWithoutCreatedByUserInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutCreatedByUserInput | CaseUpsertWithWhereUniqueWithoutCreatedByUserInput[]
    createMany?: CaseCreateManyCreatedByUserInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutCreatedByUserInput | CaseUpdateWithWhereUniqueWithoutCreatedByUserInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutCreatedByUserInput | CaseUpdateManyWithWhereWithoutCreatedByUserInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type CaseUncheckedUpdateManyWithoutCreatedByUserNestedInput = {
    create?: XOR<CaseCreateWithoutCreatedByUserInput, CaseUncheckedCreateWithoutCreatedByUserInput> | CaseCreateWithoutCreatedByUserInput[] | CaseUncheckedCreateWithoutCreatedByUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCreatedByUserInput | CaseCreateOrConnectWithoutCreatedByUserInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutCreatedByUserInput | CaseUpsertWithWhereUniqueWithoutCreatedByUserInput[]
    createMany?: CaseCreateManyCreatedByUserInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutCreatedByUserInput | CaseUpdateWithWhereUniqueWithoutCreatedByUserInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutCreatedByUserInput | CaseUpdateManyWithWhereWithoutCreatedByUserInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type HotWalletCreateNestedManyWithoutExchangeInput = {
    create?: XOR<HotWalletCreateWithoutExchangeInput, HotWalletUncheckedCreateWithoutExchangeInput> | HotWalletCreateWithoutExchangeInput[] | HotWalletUncheckedCreateWithoutExchangeInput[]
    connectOrCreate?: HotWalletCreateOrConnectWithoutExchangeInput | HotWalletCreateOrConnectWithoutExchangeInput[]
    createMany?: HotWalletCreateManyExchangeInputEnvelope
    connect?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
  }

  export type HotWalletUncheckedCreateNestedManyWithoutExchangeInput = {
    create?: XOR<HotWalletCreateWithoutExchangeInput, HotWalletUncheckedCreateWithoutExchangeInput> | HotWalletCreateWithoutExchangeInput[] | HotWalletUncheckedCreateWithoutExchangeInput[]
    connectOrCreate?: HotWalletCreateOrConnectWithoutExchangeInput | HotWalletCreateOrConnectWithoutExchangeInput[]
    createMany?: HotWalletCreateManyExchangeInputEnvelope
    connect?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
  }

  export type HotWalletUpdateManyWithoutExchangeNestedInput = {
    create?: XOR<HotWalletCreateWithoutExchangeInput, HotWalletUncheckedCreateWithoutExchangeInput> | HotWalletCreateWithoutExchangeInput[] | HotWalletUncheckedCreateWithoutExchangeInput[]
    connectOrCreate?: HotWalletCreateOrConnectWithoutExchangeInput | HotWalletCreateOrConnectWithoutExchangeInput[]
    upsert?: HotWalletUpsertWithWhereUniqueWithoutExchangeInput | HotWalletUpsertWithWhereUniqueWithoutExchangeInput[]
    createMany?: HotWalletCreateManyExchangeInputEnvelope
    set?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    disconnect?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    delete?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    connect?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    update?: HotWalletUpdateWithWhereUniqueWithoutExchangeInput | HotWalletUpdateWithWhereUniqueWithoutExchangeInput[]
    updateMany?: HotWalletUpdateManyWithWhereWithoutExchangeInput | HotWalletUpdateManyWithWhereWithoutExchangeInput[]
    deleteMany?: HotWalletScalarWhereInput | HotWalletScalarWhereInput[]
  }

  export type HotWalletUncheckedUpdateManyWithoutExchangeNestedInput = {
    create?: XOR<HotWalletCreateWithoutExchangeInput, HotWalletUncheckedCreateWithoutExchangeInput> | HotWalletCreateWithoutExchangeInput[] | HotWalletUncheckedCreateWithoutExchangeInput[]
    connectOrCreate?: HotWalletCreateOrConnectWithoutExchangeInput | HotWalletCreateOrConnectWithoutExchangeInput[]
    upsert?: HotWalletUpsertWithWhereUniqueWithoutExchangeInput | HotWalletUpsertWithWhereUniqueWithoutExchangeInput[]
    createMany?: HotWalletCreateManyExchangeInputEnvelope
    set?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    disconnect?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    delete?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    connect?: HotWalletWhereUniqueInput | HotWalletWhereUniqueInput[]
    update?: HotWalletUpdateWithWhereUniqueWithoutExchangeInput | HotWalletUpdateWithWhereUniqueWithoutExchangeInput[]
    updateMany?: HotWalletUpdateManyWithWhereWithoutExchangeInput | HotWalletUpdateManyWithWhereWithoutExchangeInput[]
    deleteMany?: HotWalletScalarWhereInput | HotWalletScalarWhereInput[]
  }

  export type ExchangeCreateNestedOneWithoutHotWalletsInput = {
    create?: XOR<ExchangeCreateWithoutHotWalletsInput, ExchangeUncheckedCreateWithoutHotWalletsInput>
    connectOrCreate?: ExchangeCreateOrConnectWithoutHotWalletsInput
    connect?: ExchangeWhereUniqueInput
  }

  export type FlowCreateNestedManyWithoutEndpointHotWalletInput = {
    create?: XOR<FlowCreateWithoutEndpointHotWalletInput, FlowUncheckedCreateWithoutEndpointHotWalletInput> | FlowCreateWithoutEndpointHotWalletInput[] | FlowUncheckedCreateWithoutEndpointHotWalletInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutEndpointHotWalletInput | FlowCreateOrConnectWithoutEndpointHotWalletInput[]
    createMany?: FlowCreateManyEndpointHotWalletInputEnvelope
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
  }

  export type FlowUncheckedCreateNestedManyWithoutEndpointHotWalletInput = {
    create?: XOR<FlowCreateWithoutEndpointHotWalletInput, FlowUncheckedCreateWithoutEndpointHotWalletInput> | FlowCreateWithoutEndpointHotWalletInput[] | FlowUncheckedCreateWithoutEndpointHotWalletInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutEndpointHotWalletInput | FlowCreateOrConnectWithoutEndpointHotWalletInput[]
    createMany?: FlowCreateManyEndpointHotWalletInputEnvelope
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
  }

  export type EnumBlockchainFieldUpdateOperationsInput = {
    set?: $Enums.Blockchain
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ExchangeUpdateOneRequiredWithoutHotWalletsNestedInput = {
    create?: XOR<ExchangeCreateWithoutHotWalletsInput, ExchangeUncheckedCreateWithoutHotWalletsInput>
    connectOrCreate?: ExchangeCreateOrConnectWithoutHotWalletsInput
    upsert?: ExchangeUpsertWithoutHotWalletsInput
    connect?: ExchangeWhereUniqueInput
    update?: XOR<XOR<ExchangeUpdateToOneWithWhereWithoutHotWalletsInput, ExchangeUpdateWithoutHotWalletsInput>, ExchangeUncheckedUpdateWithoutHotWalletsInput>
  }

  export type FlowUpdateManyWithoutEndpointHotWalletNestedInput = {
    create?: XOR<FlowCreateWithoutEndpointHotWalletInput, FlowUncheckedCreateWithoutEndpointHotWalletInput> | FlowCreateWithoutEndpointHotWalletInput[] | FlowUncheckedCreateWithoutEndpointHotWalletInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutEndpointHotWalletInput | FlowCreateOrConnectWithoutEndpointHotWalletInput[]
    upsert?: FlowUpsertWithWhereUniqueWithoutEndpointHotWalletInput | FlowUpsertWithWhereUniqueWithoutEndpointHotWalletInput[]
    createMany?: FlowCreateManyEndpointHotWalletInputEnvelope
    set?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    disconnect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    delete?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    update?: FlowUpdateWithWhereUniqueWithoutEndpointHotWalletInput | FlowUpdateWithWhereUniqueWithoutEndpointHotWalletInput[]
    updateMany?: FlowUpdateManyWithWhereWithoutEndpointHotWalletInput | FlowUpdateManyWithWhereWithoutEndpointHotWalletInput[]
    deleteMany?: FlowScalarWhereInput | FlowScalarWhereInput[]
  }

  export type FlowUncheckedUpdateManyWithoutEndpointHotWalletNestedInput = {
    create?: XOR<FlowCreateWithoutEndpointHotWalletInput, FlowUncheckedCreateWithoutEndpointHotWalletInput> | FlowCreateWithoutEndpointHotWalletInput[] | FlowUncheckedCreateWithoutEndpointHotWalletInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutEndpointHotWalletInput | FlowCreateOrConnectWithoutEndpointHotWalletInput[]
    upsert?: FlowUpsertWithWhereUniqueWithoutEndpointHotWalletInput | FlowUpsertWithWhereUniqueWithoutEndpointHotWalletInput[]
    createMany?: FlowCreateManyEndpointHotWalletInputEnvelope
    set?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    disconnect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    delete?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    update?: FlowUpdateWithWhereUniqueWithoutEndpointHotWalletInput | FlowUpdateWithWhereUniqueWithoutEndpointHotWalletInput[]
    updateMany?: FlowUpdateManyWithWhereWithoutEndpointHotWalletInput | FlowUpdateManyWithWhereWithoutEndpointHotWalletInput[]
    deleteMany?: FlowScalarWhereInput | FlowScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCasesInput = {
    create?: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCasesInput
    connect?: UserWhereUniqueInput
  }

  export type CaseSeedTransactionCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseSeedTransactionCreateWithoutCaseInput, CaseSeedTransactionUncheckedCreateWithoutCaseInput> | CaseSeedTransactionCreateWithoutCaseInput[] | CaseSeedTransactionUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseSeedTransactionCreateOrConnectWithoutCaseInput | CaseSeedTransactionCreateOrConnectWithoutCaseInput[]
    createMany?: CaseSeedTransactionCreateManyCaseInputEnvelope
    connect?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
  }

  export type FlowCreateNestedManyWithoutCaseInput = {
    create?: XOR<FlowCreateWithoutCaseInput, FlowUncheckedCreateWithoutCaseInput> | FlowCreateWithoutCaseInput[] | FlowUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutCaseInput | FlowCreateOrConnectWithoutCaseInput[]
    createMany?: FlowCreateManyCaseInputEnvelope
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
  }

  export type CaseSeedTransactionUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseSeedTransactionCreateWithoutCaseInput, CaseSeedTransactionUncheckedCreateWithoutCaseInput> | CaseSeedTransactionCreateWithoutCaseInput[] | CaseSeedTransactionUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseSeedTransactionCreateOrConnectWithoutCaseInput | CaseSeedTransactionCreateOrConnectWithoutCaseInput[]
    createMany?: CaseSeedTransactionCreateManyCaseInputEnvelope
    connect?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
  }

  export type FlowUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<FlowCreateWithoutCaseInput, FlowUncheckedCreateWithoutCaseInput> | FlowCreateWithoutCaseInput[] | FlowUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutCaseInput | FlowCreateOrConnectWithoutCaseInput[]
    createMany?: FlowCreateManyCaseInputEnvelope
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutCasesNestedInput = {
    create?: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCasesInput
    upsert?: UserUpsertWithoutCasesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCasesInput, UserUpdateWithoutCasesInput>, UserUncheckedUpdateWithoutCasesInput>
  }

  export type CaseSeedTransactionUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseSeedTransactionCreateWithoutCaseInput, CaseSeedTransactionUncheckedCreateWithoutCaseInput> | CaseSeedTransactionCreateWithoutCaseInput[] | CaseSeedTransactionUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseSeedTransactionCreateOrConnectWithoutCaseInput | CaseSeedTransactionCreateOrConnectWithoutCaseInput[]
    upsert?: CaseSeedTransactionUpsertWithWhereUniqueWithoutCaseInput | CaseSeedTransactionUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseSeedTransactionCreateManyCaseInputEnvelope
    set?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    disconnect?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    delete?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    connect?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    update?: CaseSeedTransactionUpdateWithWhereUniqueWithoutCaseInput | CaseSeedTransactionUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseSeedTransactionUpdateManyWithWhereWithoutCaseInput | CaseSeedTransactionUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseSeedTransactionScalarWhereInput | CaseSeedTransactionScalarWhereInput[]
  }

  export type FlowUpdateManyWithoutCaseNestedInput = {
    create?: XOR<FlowCreateWithoutCaseInput, FlowUncheckedCreateWithoutCaseInput> | FlowCreateWithoutCaseInput[] | FlowUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutCaseInput | FlowCreateOrConnectWithoutCaseInput[]
    upsert?: FlowUpsertWithWhereUniqueWithoutCaseInput | FlowUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: FlowCreateManyCaseInputEnvelope
    set?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    disconnect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    delete?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    update?: FlowUpdateWithWhereUniqueWithoutCaseInput | FlowUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: FlowUpdateManyWithWhereWithoutCaseInput | FlowUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: FlowScalarWhereInput | FlowScalarWhereInput[]
  }

  export type CaseSeedTransactionUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseSeedTransactionCreateWithoutCaseInput, CaseSeedTransactionUncheckedCreateWithoutCaseInput> | CaseSeedTransactionCreateWithoutCaseInput[] | CaseSeedTransactionUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseSeedTransactionCreateOrConnectWithoutCaseInput | CaseSeedTransactionCreateOrConnectWithoutCaseInput[]
    upsert?: CaseSeedTransactionUpsertWithWhereUniqueWithoutCaseInput | CaseSeedTransactionUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseSeedTransactionCreateManyCaseInputEnvelope
    set?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    disconnect?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    delete?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    connect?: CaseSeedTransactionWhereUniqueInput | CaseSeedTransactionWhereUniqueInput[]
    update?: CaseSeedTransactionUpdateWithWhereUniqueWithoutCaseInput | CaseSeedTransactionUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseSeedTransactionUpdateManyWithWhereWithoutCaseInput | CaseSeedTransactionUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseSeedTransactionScalarWhereInput | CaseSeedTransactionScalarWhereInput[]
  }

  export type FlowUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<FlowCreateWithoutCaseInput, FlowUncheckedCreateWithoutCaseInput> | FlowCreateWithoutCaseInput[] | FlowUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutCaseInput | FlowCreateOrConnectWithoutCaseInput[]
    upsert?: FlowUpsertWithWhereUniqueWithoutCaseInput | FlowUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: FlowCreateManyCaseInputEnvelope
    set?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    disconnect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    delete?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    update?: FlowUpdateWithWhereUniqueWithoutCaseInput | FlowUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: FlowUpdateManyWithWhereWithoutCaseInput | FlowUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: FlowScalarWhereInput | FlowScalarWhereInput[]
  }

  export type CaseCreateNestedOneWithoutSeedsInput = {
    create?: XOR<CaseCreateWithoutSeedsInput, CaseUncheckedCreateWithoutSeedsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutSeedsInput
    connect?: CaseWhereUniqueInput
  }

  export type FlowCreateNestedManyWithoutSeedInput = {
    create?: XOR<FlowCreateWithoutSeedInput, FlowUncheckedCreateWithoutSeedInput> | FlowCreateWithoutSeedInput[] | FlowUncheckedCreateWithoutSeedInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutSeedInput | FlowCreateOrConnectWithoutSeedInput[]
    createMany?: FlowCreateManySeedInputEnvelope
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
  }

  export type FlowUncheckedCreateNestedManyWithoutSeedInput = {
    create?: XOR<FlowCreateWithoutSeedInput, FlowUncheckedCreateWithoutSeedInput> | FlowCreateWithoutSeedInput[] | FlowUncheckedCreateWithoutSeedInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutSeedInput | FlowCreateOrConnectWithoutSeedInput[]
    createMany?: FlowCreateManySeedInputEnvelope
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
  }

  export type CaseUpdateOneRequiredWithoutSeedsNestedInput = {
    create?: XOR<CaseCreateWithoutSeedsInput, CaseUncheckedCreateWithoutSeedsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutSeedsInput
    upsert?: CaseUpsertWithoutSeedsInput
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutSeedsInput, CaseUpdateWithoutSeedsInput>, CaseUncheckedUpdateWithoutSeedsInput>
  }

  export type FlowUpdateManyWithoutSeedNestedInput = {
    create?: XOR<FlowCreateWithoutSeedInput, FlowUncheckedCreateWithoutSeedInput> | FlowCreateWithoutSeedInput[] | FlowUncheckedCreateWithoutSeedInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutSeedInput | FlowCreateOrConnectWithoutSeedInput[]
    upsert?: FlowUpsertWithWhereUniqueWithoutSeedInput | FlowUpsertWithWhereUniqueWithoutSeedInput[]
    createMany?: FlowCreateManySeedInputEnvelope
    set?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    disconnect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    delete?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    update?: FlowUpdateWithWhereUniqueWithoutSeedInput | FlowUpdateWithWhereUniqueWithoutSeedInput[]
    updateMany?: FlowUpdateManyWithWhereWithoutSeedInput | FlowUpdateManyWithWhereWithoutSeedInput[]
    deleteMany?: FlowScalarWhereInput | FlowScalarWhereInput[]
  }

  export type FlowUncheckedUpdateManyWithoutSeedNestedInput = {
    create?: XOR<FlowCreateWithoutSeedInput, FlowUncheckedCreateWithoutSeedInput> | FlowCreateWithoutSeedInput[] | FlowUncheckedCreateWithoutSeedInput[]
    connectOrCreate?: FlowCreateOrConnectWithoutSeedInput | FlowCreateOrConnectWithoutSeedInput[]
    upsert?: FlowUpsertWithWhereUniqueWithoutSeedInput | FlowUpsertWithWhereUniqueWithoutSeedInput[]
    createMany?: FlowCreateManySeedInputEnvelope
    set?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    disconnect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    delete?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    connect?: FlowWhereUniqueInput | FlowWhereUniqueInput[]
    update?: FlowUpdateWithWhereUniqueWithoutSeedInput | FlowUpdateWithWhereUniqueWithoutSeedInput[]
    updateMany?: FlowUpdateManyWithWhereWithoutSeedInput | FlowUpdateManyWithWhereWithoutSeedInput[]
    deleteMany?: FlowScalarWhereInput | FlowScalarWhereInput[]
  }

  export type CaseCreateNestedOneWithoutFlowsInput = {
    create?: XOR<CaseCreateWithoutFlowsInput, CaseUncheckedCreateWithoutFlowsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutFlowsInput
    connect?: CaseWhereUniqueInput
  }

  export type CaseSeedTransactionCreateNestedOneWithoutFlowsInput = {
    create?: XOR<CaseSeedTransactionCreateWithoutFlowsInput, CaseSeedTransactionUncheckedCreateWithoutFlowsInput>
    connectOrCreate?: CaseSeedTransactionCreateOrConnectWithoutFlowsInput
    connect?: CaseSeedTransactionWhereUniqueInput
  }

  export type HotWalletCreateNestedOneWithoutFlowsAsEndpointInput = {
    create?: XOR<HotWalletCreateWithoutFlowsAsEndpointInput, HotWalletUncheckedCreateWithoutFlowsAsEndpointInput>
    connectOrCreate?: HotWalletCreateOrConnectWithoutFlowsAsEndpointInput
    connect?: HotWalletWhereUniqueInput
  }

  export type FlowTransactionCreateNestedManyWithoutFlowInput = {
    create?: XOR<FlowTransactionCreateWithoutFlowInput, FlowTransactionUncheckedCreateWithoutFlowInput> | FlowTransactionCreateWithoutFlowInput[] | FlowTransactionUncheckedCreateWithoutFlowInput[]
    connectOrCreate?: FlowTransactionCreateOrConnectWithoutFlowInput | FlowTransactionCreateOrConnectWithoutFlowInput[]
    createMany?: FlowTransactionCreateManyFlowInputEnvelope
    connect?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
  }

  export type FlowTransactionUncheckedCreateNestedManyWithoutFlowInput = {
    create?: XOR<FlowTransactionCreateWithoutFlowInput, FlowTransactionUncheckedCreateWithoutFlowInput> | FlowTransactionCreateWithoutFlowInput[] | FlowTransactionUncheckedCreateWithoutFlowInput[]
    connectOrCreate?: FlowTransactionCreateOrConnectWithoutFlowInput | FlowTransactionCreateOrConnectWithoutFlowInput[]
    createMany?: FlowTransactionCreateManyFlowInputEnvelope
    connect?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumFlowEndpointReasonFieldUpdateOperationsInput = {
    set?: $Enums.FlowEndpointReason
  }

  export type CaseUpdateOneRequiredWithoutFlowsNestedInput = {
    create?: XOR<CaseCreateWithoutFlowsInput, CaseUncheckedCreateWithoutFlowsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutFlowsInput
    upsert?: CaseUpsertWithoutFlowsInput
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutFlowsInput, CaseUpdateWithoutFlowsInput>, CaseUncheckedUpdateWithoutFlowsInput>
  }

  export type CaseSeedTransactionUpdateOneRequiredWithoutFlowsNestedInput = {
    create?: XOR<CaseSeedTransactionCreateWithoutFlowsInput, CaseSeedTransactionUncheckedCreateWithoutFlowsInput>
    connectOrCreate?: CaseSeedTransactionCreateOrConnectWithoutFlowsInput
    upsert?: CaseSeedTransactionUpsertWithoutFlowsInput
    connect?: CaseSeedTransactionWhereUniqueInput
    update?: XOR<XOR<CaseSeedTransactionUpdateToOneWithWhereWithoutFlowsInput, CaseSeedTransactionUpdateWithoutFlowsInput>, CaseSeedTransactionUncheckedUpdateWithoutFlowsInput>
  }

  export type HotWalletUpdateOneWithoutFlowsAsEndpointNestedInput = {
    create?: XOR<HotWalletCreateWithoutFlowsAsEndpointInput, HotWalletUncheckedCreateWithoutFlowsAsEndpointInput>
    connectOrCreate?: HotWalletCreateOrConnectWithoutFlowsAsEndpointInput
    upsert?: HotWalletUpsertWithoutFlowsAsEndpointInput
    disconnect?: HotWalletWhereInput | boolean
    delete?: HotWalletWhereInput | boolean
    connect?: HotWalletWhereUniqueInput
    update?: XOR<XOR<HotWalletUpdateToOneWithWhereWithoutFlowsAsEndpointInput, HotWalletUpdateWithoutFlowsAsEndpointInput>, HotWalletUncheckedUpdateWithoutFlowsAsEndpointInput>
  }

  export type FlowTransactionUpdateManyWithoutFlowNestedInput = {
    create?: XOR<FlowTransactionCreateWithoutFlowInput, FlowTransactionUncheckedCreateWithoutFlowInput> | FlowTransactionCreateWithoutFlowInput[] | FlowTransactionUncheckedCreateWithoutFlowInput[]
    connectOrCreate?: FlowTransactionCreateOrConnectWithoutFlowInput | FlowTransactionCreateOrConnectWithoutFlowInput[]
    upsert?: FlowTransactionUpsertWithWhereUniqueWithoutFlowInput | FlowTransactionUpsertWithWhereUniqueWithoutFlowInput[]
    createMany?: FlowTransactionCreateManyFlowInputEnvelope
    set?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    disconnect?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    delete?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    connect?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    update?: FlowTransactionUpdateWithWhereUniqueWithoutFlowInput | FlowTransactionUpdateWithWhereUniqueWithoutFlowInput[]
    updateMany?: FlowTransactionUpdateManyWithWhereWithoutFlowInput | FlowTransactionUpdateManyWithWhereWithoutFlowInput[]
    deleteMany?: FlowTransactionScalarWhereInput | FlowTransactionScalarWhereInput[]
  }

  export type FlowTransactionUncheckedUpdateManyWithoutFlowNestedInput = {
    create?: XOR<FlowTransactionCreateWithoutFlowInput, FlowTransactionUncheckedCreateWithoutFlowInput> | FlowTransactionCreateWithoutFlowInput[] | FlowTransactionUncheckedCreateWithoutFlowInput[]
    connectOrCreate?: FlowTransactionCreateOrConnectWithoutFlowInput | FlowTransactionCreateOrConnectWithoutFlowInput[]
    upsert?: FlowTransactionUpsertWithWhereUniqueWithoutFlowInput | FlowTransactionUpsertWithWhereUniqueWithoutFlowInput[]
    createMany?: FlowTransactionCreateManyFlowInputEnvelope
    set?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    disconnect?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    delete?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    connect?: FlowTransactionWhereUniqueInput | FlowTransactionWhereUniqueInput[]
    update?: FlowTransactionUpdateWithWhereUniqueWithoutFlowInput | FlowTransactionUpdateWithWhereUniqueWithoutFlowInput[]
    updateMany?: FlowTransactionUpdateManyWithWhereWithoutFlowInput | FlowTransactionUpdateManyWithWhereWithoutFlowInput[]
    deleteMany?: FlowTransactionScalarWhereInput | FlowTransactionScalarWhereInput[]
  }

  export type FlowCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<FlowCreateWithoutTransactionsInput, FlowUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: FlowCreateOrConnectWithoutTransactionsInput
    connect?: FlowWhereUniqueInput
  }

  export type FlowUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<FlowCreateWithoutTransactionsInput, FlowUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: FlowCreateOrConnectWithoutTransactionsInput
    upsert?: FlowUpsertWithoutTransactionsInput
    connect?: FlowWhereUniqueInput
    update?: XOR<XOR<FlowUpdateToOneWithWhereWithoutTransactionsInput, FlowUpdateWithoutTransactionsInput>, FlowUncheckedUpdateWithoutTransactionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumBlockchainFilter<$PrismaModel = never> = {
    equals?: $Enums.Blockchain | EnumBlockchainFieldRefInput<$PrismaModel>
    in?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    notIn?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    not?: NestedEnumBlockchainFilter<$PrismaModel> | $Enums.Blockchain
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumBlockchainWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Blockchain | EnumBlockchainFieldRefInput<$PrismaModel>
    in?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    notIn?: $Enums.Blockchain[] | ListEnumBlockchainFieldRefInput<$PrismaModel>
    not?: NestedEnumBlockchainWithAggregatesFilter<$PrismaModel> | $Enums.Blockchain
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBlockchainFilter<$PrismaModel>
    _max?: NestedEnumBlockchainFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumFlowEndpointReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.FlowEndpointReason | EnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    in?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumFlowEndpointReasonFilter<$PrismaModel> | $Enums.FlowEndpointReason
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumFlowEndpointReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FlowEndpointReason | EnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    in?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlowEndpointReason[] | ListEnumFlowEndpointReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumFlowEndpointReasonWithAggregatesFilter<$PrismaModel> | $Enums.FlowEndpointReason
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFlowEndpointReasonFilter<$PrismaModel>
    _max?: NestedEnumFlowEndpointReasonFilter<$PrismaModel>
  }

  export type CaseCreateWithoutCreatedByUserInput = {
    id?: string
    externalId?: string | null
    name: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seeds?: CaseSeedTransactionCreateNestedManyWithoutCaseInput
    flows?: FlowCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutCreatedByUserInput = {
    id?: string
    externalId?: string | null
    name: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seeds?: CaseSeedTransactionUncheckedCreateNestedManyWithoutCaseInput
    flows?: FlowUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutCreatedByUserInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutCreatedByUserInput, CaseUncheckedCreateWithoutCreatedByUserInput>
  }

  export type CaseCreateManyCreatedByUserInputEnvelope = {
    data: CaseCreateManyCreatedByUserInput | CaseCreateManyCreatedByUserInput[]
    skipDuplicates?: boolean
  }

  export type CaseUpsertWithWhereUniqueWithoutCreatedByUserInput = {
    where: CaseWhereUniqueInput
    update: XOR<CaseUpdateWithoutCreatedByUserInput, CaseUncheckedUpdateWithoutCreatedByUserInput>
    create: XOR<CaseCreateWithoutCreatedByUserInput, CaseUncheckedCreateWithoutCreatedByUserInput>
  }

  export type CaseUpdateWithWhereUniqueWithoutCreatedByUserInput = {
    where: CaseWhereUniqueInput
    data: XOR<CaseUpdateWithoutCreatedByUserInput, CaseUncheckedUpdateWithoutCreatedByUserInput>
  }

  export type CaseUpdateManyWithWhereWithoutCreatedByUserInput = {
    where: CaseScalarWhereInput
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyWithoutCreatedByUserInput>
  }

  export type CaseScalarWhereInput = {
    AND?: CaseScalarWhereInput | CaseScalarWhereInput[]
    OR?: CaseScalarWhereInput[]
    NOT?: CaseScalarWhereInput | CaseScalarWhereInput[]
    id?: StringFilter<"Case"> | string
    externalId?: StringNullableFilter<"Case"> | string | null
    name?: StringFilter<"Case"> | string
    createdByUserId?: StringFilter<"Case"> | string
    totalAmountLostRaw?: StringFilter<"Case"> | string
    totalAmountLostDecimal?: StringFilter<"Case"> | string
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
  }

  export type HotWalletCreateWithoutExchangeInput = {
    id?: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    flowsAsEndpoint?: FlowCreateNestedManyWithoutEndpointHotWalletInput
  }

  export type HotWalletUncheckedCreateWithoutExchangeInput = {
    id?: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    flowsAsEndpoint?: FlowUncheckedCreateNestedManyWithoutEndpointHotWalletInput
  }

  export type HotWalletCreateOrConnectWithoutExchangeInput = {
    where: HotWalletWhereUniqueInput
    create: XOR<HotWalletCreateWithoutExchangeInput, HotWalletUncheckedCreateWithoutExchangeInput>
  }

  export type HotWalletCreateManyExchangeInputEnvelope = {
    data: HotWalletCreateManyExchangeInput | HotWalletCreateManyExchangeInput[]
    skipDuplicates?: boolean
  }

  export type HotWalletUpsertWithWhereUniqueWithoutExchangeInput = {
    where: HotWalletWhereUniqueInput
    update: XOR<HotWalletUpdateWithoutExchangeInput, HotWalletUncheckedUpdateWithoutExchangeInput>
    create: XOR<HotWalletCreateWithoutExchangeInput, HotWalletUncheckedCreateWithoutExchangeInput>
  }

  export type HotWalletUpdateWithWhereUniqueWithoutExchangeInput = {
    where: HotWalletWhereUniqueInput
    data: XOR<HotWalletUpdateWithoutExchangeInput, HotWalletUncheckedUpdateWithoutExchangeInput>
  }

  export type HotWalletUpdateManyWithWhereWithoutExchangeInput = {
    where: HotWalletScalarWhereInput
    data: XOR<HotWalletUpdateManyMutationInput, HotWalletUncheckedUpdateManyWithoutExchangeInput>
  }

  export type HotWalletScalarWhereInput = {
    AND?: HotWalletScalarWhereInput | HotWalletScalarWhereInput[]
    OR?: HotWalletScalarWhereInput[]
    NOT?: HotWalletScalarWhereInput | HotWalletScalarWhereInput[]
    id?: StringFilter<"HotWallet"> | string
    exchangeId?: StringFilter<"HotWallet"> | string
    address?: StringFilter<"HotWallet"> | string
    blockchain?: EnumBlockchainFilter<"HotWallet"> | $Enums.Blockchain
    label?: StringNullableFilter<"HotWallet"> | string | null
    isActive?: BoolFilter<"HotWallet"> | boolean
    createdAt?: DateTimeFilter<"HotWallet"> | Date | string
    updatedAt?: DateTimeFilter<"HotWallet"> | Date | string
  }

  export type ExchangeCreateWithoutHotWalletsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExchangeUncheckedCreateWithoutHotWalletsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExchangeCreateOrConnectWithoutHotWalletsInput = {
    where: ExchangeWhereUniqueInput
    create: XOR<ExchangeCreateWithoutHotWalletsInput, ExchangeUncheckedCreateWithoutHotWalletsInput>
  }

  export type FlowCreateWithoutEndpointHotWalletInput = {
    id?: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    case: CaseCreateNestedOneWithoutFlowsInput
    seed: CaseSeedTransactionCreateNestedOneWithoutFlowsInput
    transactions?: FlowTransactionCreateNestedManyWithoutFlowInput
  }

  export type FlowUncheckedCreateWithoutEndpointHotWalletInput = {
    id?: string
    caseId: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: FlowTransactionUncheckedCreateNestedManyWithoutFlowInput
  }

  export type FlowCreateOrConnectWithoutEndpointHotWalletInput = {
    where: FlowWhereUniqueInput
    create: XOR<FlowCreateWithoutEndpointHotWalletInput, FlowUncheckedCreateWithoutEndpointHotWalletInput>
  }

  export type FlowCreateManyEndpointHotWalletInputEnvelope = {
    data: FlowCreateManyEndpointHotWalletInput | FlowCreateManyEndpointHotWalletInput[]
    skipDuplicates?: boolean
  }

  export type ExchangeUpsertWithoutHotWalletsInput = {
    update: XOR<ExchangeUpdateWithoutHotWalletsInput, ExchangeUncheckedUpdateWithoutHotWalletsInput>
    create: XOR<ExchangeCreateWithoutHotWalletsInput, ExchangeUncheckedCreateWithoutHotWalletsInput>
    where?: ExchangeWhereInput
  }

  export type ExchangeUpdateToOneWithWhereWithoutHotWalletsInput = {
    where?: ExchangeWhereInput
    data: XOR<ExchangeUpdateWithoutHotWalletsInput, ExchangeUncheckedUpdateWithoutHotWalletsInput>
  }

  export type ExchangeUpdateWithoutHotWalletsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExchangeUncheckedUpdateWithoutHotWalletsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowUpsertWithWhereUniqueWithoutEndpointHotWalletInput = {
    where: FlowWhereUniqueInput
    update: XOR<FlowUpdateWithoutEndpointHotWalletInput, FlowUncheckedUpdateWithoutEndpointHotWalletInput>
    create: XOR<FlowCreateWithoutEndpointHotWalletInput, FlowUncheckedCreateWithoutEndpointHotWalletInput>
  }

  export type FlowUpdateWithWhereUniqueWithoutEndpointHotWalletInput = {
    where: FlowWhereUniqueInput
    data: XOR<FlowUpdateWithoutEndpointHotWalletInput, FlowUncheckedUpdateWithoutEndpointHotWalletInput>
  }

  export type FlowUpdateManyWithWhereWithoutEndpointHotWalletInput = {
    where: FlowScalarWhereInput
    data: XOR<FlowUpdateManyMutationInput, FlowUncheckedUpdateManyWithoutEndpointHotWalletInput>
  }

  export type FlowScalarWhereInput = {
    AND?: FlowScalarWhereInput | FlowScalarWhereInput[]
    OR?: FlowScalarWhereInput[]
    NOT?: FlowScalarWhereInput | FlowScalarWhereInput[]
    id?: StringFilter<"Flow"> | string
    caseId?: StringFilter<"Flow"> | string
    seedId?: StringFilter<"Flow"> | string
    blockchain?: EnumBlockchainFilter<"Flow"> | $Enums.Blockchain
    tokenAddress?: StringNullableFilter<"Flow"> | string | null
    tokenSymbol?: StringNullableFilter<"Flow"> | string | null
    totalAmountRaw?: StringFilter<"Flow"> | string
    totalAmountDecimal?: StringFilter<"Flow"> | string
    hopsCount?: IntFilter<"Flow"> | number
    endpointAddress?: StringFilter<"Flow"> | string
    endpointReason?: EnumFlowEndpointReasonFilter<"Flow"> | $Enums.FlowEndpointReason
    endpointHotWalletId?: StringNullableFilter<"Flow"> | string | null
    isEndpointExchange?: BoolFilter<"Flow"> | boolean
    createdAt?: DateTimeFilter<"Flow"> | Date | string
    updatedAt?: DateTimeFilter<"Flow"> | Date | string
  }

  export type UserCreateWithoutCasesInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutCasesInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutCasesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
  }

  export type CaseSeedTransactionCreateWithoutCaseInput = {
    id?: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
    flows?: FlowCreateNestedManyWithoutSeedInput
  }

  export type CaseSeedTransactionUncheckedCreateWithoutCaseInput = {
    id?: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
    flows?: FlowUncheckedCreateNestedManyWithoutSeedInput
  }

  export type CaseSeedTransactionCreateOrConnectWithoutCaseInput = {
    where: CaseSeedTransactionWhereUniqueInput
    create: XOR<CaseSeedTransactionCreateWithoutCaseInput, CaseSeedTransactionUncheckedCreateWithoutCaseInput>
  }

  export type CaseSeedTransactionCreateManyCaseInputEnvelope = {
    data: CaseSeedTransactionCreateManyCaseInput | CaseSeedTransactionCreateManyCaseInput[]
    skipDuplicates?: boolean
  }

  export type FlowCreateWithoutCaseInput = {
    id?: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    seed: CaseSeedTransactionCreateNestedOneWithoutFlowsInput
    endpointHotWallet?: HotWalletCreateNestedOneWithoutFlowsAsEndpointInput
    transactions?: FlowTransactionCreateNestedManyWithoutFlowInput
  }

  export type FlowUncheckedCreateWithoutCaseInput = {
    id?: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId?: string | null
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: FlowTransactionUncheckedCreateNestedManyWithoutFlowInput
  }

  export type FlowCreateOrConnectWithoutCaseInput = {
    where: FlowWhereUniqueInput
    create: XOR<FlowCreateWithoutCaseInput, FlowUncheckedCreateWithoutCaseInput>
  }

  export type FlowCreateManyCaseInputEnvelope = {
    data: FlowCreateManyCaseInput | FlowCreateManyCaseInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCasesInput = {
    update: XOR<UserUpdateWithoutCasesInput, UserUncheckedUpdateWithoutCasesInput>
    create: XOR<UserCreateWithoutCasesInput, UserUncheckedCreateWithoutCasesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCasesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCasesInput, UserUncheckedUpdateWithoutCasesInput>
  }

  export type UserUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseSeedTransactionUpsertWithWhereUniqueWithoutCaseInput = {
    where: CaseSeedTransactionWhereUniqueInput
    update: XOR<CaseSeedTransactionUpdateWithoutCaseInput, CaseSeedTransactionUncheckedUpdateWithoutCaseInput>
    create: XOR<CaseSeedTransactionCreateWithoutCaseInput, CaseSeedTransactionUncheckedCreateWithoutCaseInput>
  }

  export type CaseSeedTransactionUpdateWithWhereUniqueWithoutCaseInput = {
    where: CaseSeedTransactionWhereUniqueInput
    data: XOR<CaseSeedTransactionUpdateWithoutCaseInput, CaseSeedTransactionUncheckedUpdateWithoutCaseInput>
  }

  export type CaseSeedTransactionUpdateManyWithWhereWithoutCaseInput = {
    where: CaseSeedTransactionScalarWhereInput
    data: XOR<CaseSeedTransactionUpdateManyMutationInput, CaseSeedTransactionUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseSeedTransactionScalarWhereInput = {
    AND?: CaseSeedTransactionScalarWhereInput | CaseSeedTransactionScalarWhereInput[]
    OR?: CaseSeedTransactionScalarWhereInput[]
    NOT?: CaseSeedTransactionScalarWhereInput | CaseSeedTransactionScalarWhereInput[]
    id?: StringFilter<"CaseSeedTransaction"> | string
    caseId?: StringFilter<"CaseSeedTransaction"> | string
    txHash?: StringFilter<"CaseSeedTransaction"> | string
    blockchain?: EnumBlockchainFilter<"CaseSeedTransaction"> | $Enums.Blockchain
    tokenAddress?: StringNullableFilter<"CaseSeedTransaction"> | string | null
    tokenSymbol?: StringNullableFilter<"CaseSeedTransaction"> | string | null
    amountRaw?: StringFilter<"CaseSeedTransaction"> | string
    amountDecimal?: StringFilter<"CaseSeedTransaction"> | string
    timestamp?: DateTimeFilter<"CaseSeedTransaction"> | Date | string
    createdAt?: DateTimeFilter<"CaseSeedTransaction"> | Date | string
  }

  export type FlowUpsertWithWhereUniqueWithoutCaseInput = {
    where: FlowWhereUniqueInput
    update: XOR<FlowUpdateWithoutCaseInput, FlowUncheckedUpdateWithoutCaseInput>
    create: XOR<FlowCreateWithoutCaseInput, FlowUncheckedCreateWithoutCaseInput>
  }

  export type FlowUpdateWithWhereUniqueWithoutCaseInput = {
    where: FlowWhereUniqueInput
    data: XOR<FlowUpdateWithoutCaseInput, FlowUncheckedUpdateWithoutCaseInput>
  }

  export type FlowUpdateManyWithWhereWithoutCaseInput = {
    where: FlowScalarWhereInput
    data: XOR<FlowUpdateManyMutationInput, FlowUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseCreateWithoutSeedsInput = {
    id?: string
    externalId?: string | null
    name: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByUser: UserCreateNestedOneWithoutCasesInput
    flows?: FlowCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutSeedsInput = {
    id?: string
    externalId?: string | null
    name: string
    createdByUserId: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    flows?: FlowUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutSeedsInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutSeedsInput, CaseUncheckedCreateWithoutSeedsInput>
  }

  export type FlowCreateWithoutSeedInput = {
    id?: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    case: CaseCreateNestedOneWithoutFlowsInput
    endpointHotWallet?: HotWalletCreateNestedOneWithoutFlowsAsEndpointInput
    transactions?: FlowTransactionCreateNestedManyWithoutFlowInput
  }

  export type FlowUncheckedCreateWithoutSeedInput = {
    id?: string
    caseId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId?: string | null
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: FlowTransactionUncheckedCreateNestedManyWithoutFlowInput
  }

  export type FlowCreateOrConnectWithoutSeedInput = {
    where: FlowWhereUniqueInput
    create: XOR<FlowCreateWithoutSeedInput, FlowUncheckedCreateWithoutSeedInput>
  }

  export type FlowCreateManySeedInputEnvelope = {
    data: FlowCreateManySeedInput | FlowCreateManySeedInput[]
    skipDuplicates?: boolean
  }

  export type CaseUpsertWithoutSeedsInput = {
    update: XOR<CaseUpdateWithoutSeedsInput, CaseUncheckedUpdateWithoutSeedsInput>
    create: XOR<CaseCreateWithoutSeedsInput, CaseUncheckedCreateWithoutSeedsInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutSeedsInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutSeedsInput, CaseUncheckedUpdateWithoutSeedsInput>
  }

  export type CaseUpdateWithoutSeedsInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByUser?: UserUpdateOneRequiredWithoutCasesNestedInput
    flows?: FlowUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutSeedsInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flows?: FlowUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type FlowUpsertWithWhereUniqueWithoutSeedInput = {
    where: FlowWhereUniqueInput
    update: XOR<FlowUpdateWithoutSeedInput, FlowUncheckedUpdateWithoutSeedInput>
    create: XOR<FlowCreateWithoutSeedInput, FlowUncheckedCreateWithoutSeedInput>
  }

  export type FlowUpdateWithWhereUniqueWithoutSeedInput = {
    where: FlowWhereUniqueInput
    data: XOR<FlowUpdateWithoutSeedInput, FlowUncheckedUpdateWithoutSeedInput>
  }

  export type FlowUpdateManyWithWhereWithoutSeedInput = {
    where: FlowScalarWhereInput
    data: XOR<FlowUpdateManyMutationInput, FlowUncheckedUpdateManyWithoutSeedInput>
  }

  export type CaseCreateWithoutFlowsInput = {
    id?: string
    externalId?: string | null
    name: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByUser: UserCreateNestedOneWithoutCasesInput
    seeds?: CaseSeedTransactionCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutFlowsInput = {
    id?: string
    externalId?: string | null
    name: string
    createdByUserId: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seeds?: CaseSeedTransactionUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutFlowsInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutFlowsInput, CaseUncheckedCreateWithoutFlowsInput>
  }

  export type CaseSeedTransactionCreateWithoutFlowsInput = {
    id?: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
    case: CaseCreateNestedOneWithoutSeedsInput
  }

  export type CaseSeedTransactionUncheckedCreateWithoutFlowsInput = {
    id?: string
    caseId: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type CaseSeedTransactionCreateOrConnectWithoutFlowsInput = {
    where: CaseSeedTransactionWhereUniqueInput
    create: XOR<CaseSeedTransactionCreateWithoutFlowsInput, CaseSeedTransactionUncheckedCreateWithoutFlowsInput>
  }

  export type HotWalletCreateWithoutFlowsAsEndpointInput = {
    id?: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    exchange: ExchangeCreateNestedOneWithoutHotWalletsInput
  }

  export type HotWalletUncheckedCreateWithoutFlowsAsEndpointInput = {
    id?: string
    exchangeId: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HotWalletCreateOrConnectWithoutFlowsAsEndpointInput = {
    where: HotWalletWhereUniqueInput
    create: XOR<HotWalletCreateWithoutFlowsAsEndpointInput, HotWalletUncheckedCreateWithoutFlowsAsEndpointInput>
  }

  export type FlowTransactionCreateWithoutFlowInput = {
    id?: string
    hopIndex: number
    txHash: string
    blockchain: $Enums.Blockchain
    fromAddress: string
    toAddress: string
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    isEndpointHop?: boolean
    createdAt?: Date | string
  }

  export type FlowTransactionUncheckedCreateWithoutFlowInput = {
    id?: string
    hopIndex: number
    txHash: string
    blockchain: $Enums.Blockchain
    fromAddress: string
    toAddress: string
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    isEndpointHop?: boolean
    createdAt?: Date | string
  }

  export type FlowTransactionCreateOrConnectWithoutFlowInput = {
    where: FlowTransactionWhereUniqueInput
    create: XOR<FlowTransactionCreateWithoutFlowInput, FlowTransactionUncheckedCreateWithoutFlowInput>
  }

  export type FlowTransactionCreateManyFlowInputEnvelope = {
    data: FlowTransactionCreateManyFlowInput | FlowTransactionCreateManyFlowInput[]
    skipDuplicates?: boolean
  }

  export type CaseUpsertWithoutFlowsInput = {
    update: XOR<CaseUpdateWithoutFlowsInput, CaseUncheckedUpdateWithoutFlowsInput>
    create: XOR<CaseCreateWithoutFlowsInput, CaseUncheckedCreateWithoutFlowsInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutFlowsInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutFlowsInput, CaseUncheckedUpdateWithoutFlowsInput>
  }

  export type CaseUpdateWithoutFlowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByUser?: UserUpdateOneRequiredWithoutCasesNestedInput
    seeds?: CaseSeedTransactionUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutFlowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdByUserId?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seeds?: CaseSeedTransactionUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseSeedTransactionUpsertWithoutFlowsInput = {
    update: XOR<CaseSeedTransactionUpdateWithoutFlowsInput, CaseSeedTransactionUncheckedUpdateWithoutFlowsInput>
    create: XOR<CaseSeedTransactionCreateWithoutFlowsInput, CaseSeedTransactionUncheckedCreateWithoutFlowsInput>
    where?: CaseSeedTransactionWhereInput
  }

  export type CaseSeedTransactionUpdateToOneWithWhereWithoutFlowsInput = {
    where?: CaseSeedTransactionWhereInput
    data: XOR<CaseSeedTransactionUpdateWithoutFlowsInput, CaseSeedTransactionUncheckedUpdateWithoutFlowsInput>
  }

  export type CaseSeedTransactionUpdateWithoutFlowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutSeedsNestedInput
  }

  export type CaseSeedTransactionUncheckedUpdateWithoutFlowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotWalletUpsertWithoutFlowsAsEndpointInput = {
    update: XOR<HotWalletUpdateWithoutFlowsAsEndpointInput, HotWalletUncheckedUpdateWithoutFlowsAsEndpointInput>
    create: XOR<HotWalletCreateWithoutFlowsAsEndpointInput, HotWalletUncheckedCreateWithoutFlowsAsEndpointInput>
    where?: HotWalletWhereInput
  }

  export type HotWalletUpdateToOneWithWhereWithoutFlowsAsEndpointInput = {
    where?: HotWalletWhereInput
    data: XOR<HotWalletUpdateWithoutFlowsAsEndpointInput, HotWalletUncheckedUpdateWithoutFlowsAsEndpointInput>
  }

  export type HotWalletUpdateWithoutFlowsAsEndpointInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exchange?: ExchangeUpdateOneRequiredWithoutHotWalletsNestedInput
  }

  export type HotWalletUncheckedUpdateWithoutFlowsAsEndpointInput = {
    id?: StringFieldUpdateOperationsInput | string
    exchangeId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowTransactionUpsertWithWhereUniqueWithoutFlowInput = {
    where: FlowTransactionWhereUniqueInput
    update: XOR<FlowTransactionUpdateWithoutFlowInput, FlowTransactionUncheckedUpdateWithoutFlowInput>
    create: XOR<FlowTransactionCreateWithoutFlowInput, FlowTransactionUncheckedCreateWithoutFlowInput>
  }

  export type FlowTransactionUpdateWithWhereUniqueWithoutFlowInput = {
    where: FlowTransactionWhereUniqueInput
    data: XOR<FlowTransactionUpdateWithoutFlowInput, FlowTransactionUncheckedUpdateWithoutFlowInput>
  }

  export type FlowTransactionUpdateManyWithWhereWithoutFlowInput = {
    where: FlowTransactionScalarWhereInput
    data: XOR<FlowTransactionUpdateManyMutationInput, FlowTransactionUncheckedUpdateManyWithoutFlowInput>
  }

  export type FlowTransactionScalarWhereInput = {
    AND?: FlowTransactionScalarWhereInput | FlowTransactionScalarWhereInput[]
    OR?: FlowTransactionScalarWhereInput[]
    NOT?: FlowTransactionScalarWhereInput | FlowTransactionScalarWhereInput[]
    id?: StringFilter<"FlowTransaction"> | string
    flowId?: StringFilter<"FlowTransaction"> | string
    hopIndex?: IntFilter<"FlowTransaction"> | number
    txHash?: StringFilter<"FlowTransaction"> | string
    blockchain?: EnumBlockchainFilter<"FlowTransaction"> | $Enums.Blockchain
    fromAddress?: StringFilter<"FlowTransaction"> | string
    toAddress?: StringFilter<"FlowTransaction"> | string
    tokenAddress?: StringNullableFilter<"FlowTransaction"> | string | null
    tokenSymbol?: StringNullableFilter<"FlowTransaction"> | string | null
    amountRaw?: StringFilter<"FlowTransaction"> | string
    amountDecimal?: StringFilter<"FlowTransaction"> | string
    timestamp?: DateTimeFilter<"FlowTransaction"> | Date | string
    isEndpointHop?: BoolFilter<"FlowTransaction"> | boolean
    createdAt?: DateTimeFilter<"FlowTransaction"> | Date | string
  }

  export type FlowCreateWithoutTransactionsInput = {
    id?: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    case: CaseCreateNestedOneWithoutFlowsInput
    seed: CaseSeedTransactionCreateNestedOneWithoutFlowsInput
    endpointHotWallet?: HotWalletCreateNestedOneWithoutFlowsAsEndpointInput
  }

  export type FlowUncheckedCreateWithoutTransactionsInput = {
    id?: string
    caseId: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId?: string | null
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlowCreateOrConnectWithoutTransactionsInput = {
    where: FlowWhereUniqueInput
    create: XOR<FlowCreateWithoutTransactionsInput, FlowUncheckedCreateWithoutTransactionsInput>
  }

  export type FlowUpsertWithoutTransactionsInput = {
    update: XOR<FlowUpdateWithoutTransactionsInput, FlowUncheckedUpdateWithoutTransactionsInput>
    create: XOR<FlowCreateWithoutTransactionsInput, FlowUncheckedCreateWithoutTransactionsInput>
    where?: FlowWhereInput
  }

  export type FlowUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: FlowWhereInput
    data: XOR<FlowUpdateWithoutTransactionsInput, FlowUncheckedUpdateWithoutTransactionsInput>
  }

  export type FlowUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutFlowsNestedInput
    seed?: CaseSeedTransactionUpdateOneRequiredWithoutFlowsNestedInput
    endpointHotWallet?: HotWalletUpdateOneWithoutFlowsAsEndpointNestedInput
  }

  export type FlowUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    seedId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    endpointHotWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseCreateManyCreatedByUserInput = {
    id?: string
    externalId?: string | null
    name: string
    totalAmountLostRaw: string
    totalAmountLostDecimal: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CaseUpdateWithoutCreatedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seeds?: CaseSeedTransactionUpdateManyWithoutCaseNestedInput
    flows?: FlowUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutCreatedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seeds?: CaseSeedTransactionUncheckedUpdateManyWithoutCaseNestedInput
    flows?: FlowUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateManyWithoutCreatedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    totalAmountLostRaw?: StringFieldUpdateOperationsInput | string
    totalAmountLostDecimal?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotWalletCreateManyExchangeInput = {
    id?: string
    address: string
    blockchain: $Enums.Blockchain
    label?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HotWalletUpdateWithoutExchangeInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flowsAsEndpoint?: FlowUpdateManyWithoutEndpointHotWalletNestedInput
  }

  export type HotWalletUncheckedUpdateWithoutExchangeInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flowsAsEndpoint?: FlowUncheckedUpdateManyWithoutEndpointHotWalletNestedInput
  }

  export type HotWalletUncheckedUpdateManyWithoutExchangeInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    label?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowCreateManyEndpointHotWalletInput = {
    id?: string
    caseId: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlowUpdateWithoutEndpointHotWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutFlowsNestedInput
    seed?: CaseSeedTransactionUpdateOneRequiredWithoutFlowsNestedInput
    transactions?: FlowTransactionUpdateManyWithoutFlowNestedInput
  }

  export type FlowUncheckedUpdateWithoutEndpointHotWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    seedId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: FlowTransactionUncheckedUpdateManyWithoutFlowNestedInput
  }

  export type FlowUncheckedUpdateManyWithoutEndpointHotWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    seedId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseSeedTransactionCreateManyCaseInput = {
    id?: string
    txHash: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type FlowCreateManyCaseInput = {
    id?: string
    seedId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId?: string | null
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CaseSeedTransactionUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flows?: FlowUpdateManyWithoutSeedNestedInput
  }

  export type CaseSeedTransactionUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    flows?: FlowUncheckedUpdateManyWithoutSeedNestedInput
  }

  export type CaseSeedTransactionUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seed?: CaseSeedTransactionUpdateOneRequiredWithoutFlowsNestedInput
    endpointHotWallet?: HotWalletUpdateOneWithoutFlowsAsEndpointNestedInput
    transactions?: FlowTransactionUpdateManyWithoutFlowNestedInput
  }

  export type FlowUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    seedId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    endpointHotWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: FlowTransactionUncheckedUpdateManyWithoutFlowNestedInput
  }

  export type FlowUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    seedId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    endpointHotWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowCreateManySeedInput = {
    id?: string
    caseId: string
    blockchain: $Enums.Blockchain
    tokenAddress?: string | null
    tokenSymbol?: string | null
    totalAmountRaw: string
    totalAmountDecimal: string
    hopsCount: number
    endpointAddress: string
    endpointReason: $Enums.FlowEndpointReason
    endpointHotWalletId?: string | null
    isEndpointExchange?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlowUpdateWithoutSeedInput = {
    id?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneRequiredWithoutFlowsNestedInput
    endpointHotWallet?: HotWalletUpdateOneWithoutFlowsAsEndpointNestedInput
    transactions?: FlowTransactionUpdateManyWithoutFlowNestedInput
  }

  export type FlowUncheckedUpdateWithoutSeedInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    endpointHotWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: FlowTransactionUncheckedUpdateManyWithoutFlowNestedInput
  }

  export type FlowUncheckedUpdateManyWithoutSeedInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmountRaw?: StringFieldUpdateOperationsInput | string
    totalAmountDecimal?: StringFieldUpdateOperationsInput | string
    hopsCount?: IntFieldUpdateOperationsInput | number
    endpointAddress?: StringFieldUpdateOperationsInput | string
    endpointReason?: EnumFlowEndpointReasonFieldUpdateOperationsInput | $Enums.FlowEndpointReason
    endpointHotWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    isEndpointExchange?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowTransactionCreateManyFlowInput = {
    id?: string
    hopIndex: number
    txHash: string
    blockchain: $Enums.Blockchain
    fromAddress: string
    toAddress: string
    tokenAddress?: string | null
    tokenSymbol?: string | null
    amountRaw: string
    amountDecimal: string
    timestamp: Date | string
    isEndpointHop?: boolean
    createdAt?: Date | string
  }

  export type FlowTransactionUpdateWithoutFlowInput = {
    id?: StringFieldUpdateOperationsInput | string
    hopIndex?: IntFieldUpdateOperationsInput | number
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    fromAddress?: StringFieldUpdateOperationsInput | string
    toAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isEndpointHop?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowTransactionUncheckedUpdateWithoutFlowInput = {
    id?: StringFieldUpdateOperationsInput | string
    hopIndex?: IntFieldUpdateOperationsInput | number
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    fromAddress?: StringFieldUpdateOperationsInput | string
    toAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isEndpointHop?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlowTransactionUncheckedUpdateManyWithoutFlowInput = {
    id?: StringFieldUpdateOperationsInput | string
    hopIndex?: IntFieldUpdateOperationsInput | number
    txHash?: StringFieldUpdateOperationsInput | string
    blockchain?: EnumBlockchainFieldUpdateOperationsInput | $Enums.Blockchain
    fromAddress?: StringFieldUpdateOperationsInput | string
    toAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    amountRaw?: StringFieldUpdateOperationsInput | string
    amountDecimal?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isEndpointHop?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}