/**
 * A module that helps Tiny-bit automatically avoid obstacles.
 * 一个帮助Tiny-bit自动化避障的模块.
 * @author: yuN1.
 * @version: v1.0.0
 */
namespace ObstacleAvoidance {

    /**
     * A namespace that holds all the data needed by Tiny-bit to run this module.
     * 一个保存了所有关于Tiny-bit运行此模块所需的数据的命名空间.
     */
    export namespace Data {

        /**
         * A variable used to record whether Tiny-bit is running.
         * 一个用于记录Tiny-bit是否正在运行的变量.
         */
        export let isRunning: boolean = false;

        /**
         * A variable used to record whether Tiny-bit stops.
         * 一个用于记录Tiny-bit是否停下了的变量.
         */
        export let isStopped: boolean = false;

        /**
         * A variable used to record whether Tiny-bit is running in "FastMode".
         * 一个用于记录Tiny-bit是否运行于"快速模式"的变量.
         */
        export let isFastMode: boolean = true;

        /**
         * A variable that stores some time for delaying Tiny-bit between turns.
         * 一个存储着在转弯之间停止Tiny-bit一段时间的变量.
         */
        export let delayTime: number = 350;

        /**
         * An object with Tiny-bit ultrasonic detection distance stored.
         * 一个保存着Tiny-bit超声波检测距离的对象.
         */
        export const ultrasonic = {
            FAST: {
                distance: 30
            },
            SLOW: {
                distance: 24
            }
        };

        /**
         * An object with Tiny-bit running speed stored.
         * 一个存储着Tiny-bit运行速度的对象.
         */
        export const running = {
            FAST: {
                runningSpeed: 225
            },
            SLOW: {
                runningSpeed: 105
            }
        };

        /**
         * An object that stores relevant data when Tiny-bit turns.
         * 一个存储着Tiny-bit转弯时相关数据的对象.
         */
        export const turning = {
            FAST: {
                turningSpeed: 170, // 170
                turningTime: 125 // 250
            },
            SLOW: {
                turningSpeed: 95, // 95
                turningTime: 250 // 500
            }
        };

        /**
         * Returns the detection distance of Tiny-bit 's ultrasonic.
         * 返回Tiny-bit的超声波的检测距离.
         * @returns object
         */
        export function getUltrasonic(): number {
            if (isFastMode) {
                return ultrasonic.FAST;
            } else {
                return ultrasonic.SLOW;
            }
        }

        /**
         * Returns the running speed of Tiny-bit.
         * 返回Tiny-bit的运行速度.
         * @returns object
         */
        export function getRunning(): number {
            if (isFastMode) {
                return running.FAST;
            } else {
                return running.SLOW;
            }
        }

        /**
         * Returns the relevant data of Tiny-bit turning.
         * 返回Tiny-bit转弯时的相关数据.
         * @returns object
         */
        export function getTurning(): number {
            // if (isFastMode) {
            //     return turning.FAST;
            // } else {
            //     return turning.SLOW;
            // }
            return turning.FAST;
        }

        /**
         * Switch 'isFastMode' to the opposite state.
         * 将'isFastMode'切换到相反一面.
         * @returns void
         */
        function switchFastMode() {
            isFastMode = !isFastMode;
        }

        /**
         * Switch 'isRunning' to the opposite state.
         * 将'isRunning'切换到相反一面.
         * @returns void
         */
        function switchRunning() {
            isRunning = !isRunning;
        }
    };

    /**
     * A namespace that controls Tiny-bit automatically avoid obstacles.
     * 一个控制着Tiny-bit自动化避障的命名空间.
     */
    export namespace CarControlling {
        /**
         * Let Tiny-bit turn.
         * 让Tiny-bit转弯.
         * @param direction The direction that you want to turn.
         * @param frequency The frequency that you want to turn.
         * @returns void
         */
        function spinTurn(direction: Tinybit.CarState, frequency: number = 1) {
            carStop();
            while (frequency > 0) {
                const turning = Data.getTurning()
                Tinybit.CarCtrlSpeed(direction, turning.turningSpeed);
                basic.pause(turning.turningTime);
                Tinybit.CarCtrl(Tinybit.CarState.Car_Stop);
                basic.pause(Data.delayTime);
                frequency--;
            }
        }

        /**
         * Let Tiny-bit go forward.
         * 让Tiny-bit前进.
         * @returns void
         */
        export function carForward() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Run, Data.getRunning().runningSpeed);
        }

        /**
         * Let Tiny-bit go backward.
         * 让Tiny-bit后退.
         * @returns void
         */
        export function carBackward() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Back, Data.getRunning().runningSpeed);
        }

        /**
         * Let Tiny-bit turn left.
         * 让Tiny-bit左转.
         * @returns void
         */
        export function carTurnLeft(times: number = 1) {
            spinTurn(Tinybit.CarState.Car_SpinLeft, times);
        }

        /**
         * Let Tiny-bit turn right.
         * 让Tiny-bit右转.
         * @returns void
         */
        export function carTurnRight(times: number = 1) {
            spinTurn(Tinybit.CarState.Car_SpinRight, times);
        }

        /**
         * Let Tiny-bit stop.
         * 让Tiny-bit停下.
         * @returns void
         */
        export function carStop() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Back, 30);
            basic.pause(100);
            Tinybit.CarCtrl(Tinybit.CarState.Car_Stop);
        }

        /**
         * Checks if there's any obstacle in front of Tiny-bit.
         * 检查Tiny-bit前面是否有任何障碍物.
         * @param ifTrue if it's true then do sth.
         * @returns boolean
         */
        export function ifAnyObstacleFronted(ifTrue: () => void): boolean {
            if (Tinybit.Ultrasonic_Car() <= Data.getUltrasonic().distance) {
                ifTrue();
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Initializes this module.
     * 初始化这个模块.
     * @returns void
     */
    export function initialize() {

    }

    /**
     * Do the things like checking the obstacles, going forward or anything.
     * 循环时需要做的.
     * @returns void
     */
    export function runEachLoop() {
        CarControlling.ifAnyObstacleFronted(() => {
            CarControlling.carStop();
            CarControlling.carTurnLeft();
            CarControlling.ifAnyObstacleFronted(() => {
                CarControlling.carTurnRight(2);
                CarControlling.ifAnyObstacleFronted(() => {
                    CarControlling.carTurnRight();
                });
            });
        });
        CarControlling.carForward();
    }
};
