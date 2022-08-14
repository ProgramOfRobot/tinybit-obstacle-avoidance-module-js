/**
 * A module that can help you control Tiny-bit better.
 * @author: 9reyyy
 * @version: a1.0.0
 */
namespace ObstacleAvoidance {

    /**
     * A namespace that saves all the data about Tiny-bit.
     */
    export namespace Data {

        /**
         * A variable that records if the car is running.
         */
        export let isRunning = false;

        /**
         * A variable that records if the car is stopping.
         */
        export let isStopped = false;

        /**
         * A variable that records if the car is running fast.
         */
        export let isFastMode = true;

        /**
         * A variable that uses to delay the time between turning and running.
         */
        export let delayTime = 350;

        /**
         * An object to save the checking distance of ultrasonic.
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
         * An object to save the running speed for Tiny-bit.
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
         * An object to save the turning speed and time for Tiny-bit.
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
         * Returns the checking distance of ultrasonic.
         * @returns object
         */
        export function getUltrasonic() {
            if (isFastMode) {
                return ultrasonic.FAST;
            } else {
                return ultrasonic.SLOW;
            }
        }

        /**
         * Returns the running speed of Tiny-bit.
         * @returns object
         */
        export function getRunning() {
            if (isFastMode) {
                return running.FAST;
            } else {
                return running.SLOW;
            }
        }

        /**
         * Returns the turning speed and the time of Tiny-bit.
         * @returns object
         */
        export function getTurning() {
            // if (isFastMode) {
            //     return turning.FAST;
            // } else {
            //     return turning.SLOW;
            // }
            return turning.FAST;
        }

        /**
         * Switch 'isFastMode' to the opposite state.
         * @returns void
         */
        function switchFastMode() {
            isFastMode = !isFastMode;
        }

        /**
         * Switch 'isRunning' to the opposite state.
         * @returns void
         */
        function switchRunning() {
            isRunning = !isRunning;
        }
    };

    /**
     * A namespace that can help you control Tiny-bit.
     */
    export namespace CarControlling {
        /**
         * Let Tiny-bit turns to a direction.
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
         * @returns void
         */
        export function carForward() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Run, Data.getRunning().runningSpeed);
        }

        /**
         * Let Tiny-bit go backward.
         * @returns void
         */
        export function carBackward() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Back, Data.getRunning().runningSpeed);
        }

        /**
         * Let Tiny-bit turn left.
         * @returns void
         */
        export function carTurnLeft(times: number = 1) {
            spinTurn(Tinybit.CarState.Car_SpinLeft, times);
        }

        /**
         * Let Tiny-bit turn right.
         * @returns void
         */
        export function carTurnRight(times: number = 1) {
            spinTurn(Tinybit.CarState.Car_SpinRight, times);
        }

        /**
         * Let Tiny-bit stop.
         * @returns void
         */
        export function carStop() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Back, 30);
            basic.pause(100);
            Tinybit.CarCtrl(Tinybit.CarState.Car_Stop);
        }

        /**
         * Checks if there's any obstacle in front of Tiny-bit.
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
     * @returns void
     */
    export function initialize() {

    }

    /**
     * Do the things like checking the obstacles, going forward or anything.
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
