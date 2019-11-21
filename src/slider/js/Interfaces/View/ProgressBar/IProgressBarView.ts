export default interface IProgressBarView {
  updateProgressBar(runnerFromPosition: number, runnerToPosition: number | null): void;
}
