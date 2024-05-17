class FrameLoader {
  constructor(options) {
    this.canvas = options.container;
    this.canvas.width = options.width || 800;
    this.canvas.height = options.height || 600;
    this.context = this.canvas.getContext("2d");
    this.assetPath = options.assetPath;
    this.baseName = options.baseName || "frame";
    this.fileExt = options.fileExt || "webp";
    this.indexStart = options.indexStart || 0;
    this.indexEnd =
      options.indexEnd || this.indexStart + options.frameCount - 1;
    this.requestedFrame = this.indexStart;
    this.frameCount = this.indexEnd - this.indexStart + 1;
    this.imageStates = {};
    this.loadQueue = []; // This will store the priority order of frames
    this.BATCH_SIZE = 10; // Number of images to load per batch
    this.isFirstBatchLoading = false; // Track if a batch is currently loading
    this.numLoaded = 0;
    this.isFullyLoaded = false;
    this.isUnmounted = false;
    this.id = options.id;

    console.log(`[${this.id}] FramePlayer constructor`);

    this.initLoad();
  }

  initLoad() {
    this.goToFrame(this.requestedFrame);
  }

  handleOnLoad(frameIndex) {
    const imageState = this.imageStates[frameIndex];
    imageState.status = "loaded";
    this.numLoaded++;
    if (this.numLoaded === this.frameCount) {
      this.isFullyLoaded = true;
    }

    if (frameIndex === this.requestedFrame) {
      this.render(frameIndex);
    }

    this.loadNextImages(1); // Load next image based on priority
  }

  handleOnError(frameIndex) {
    console.error(`[${this.id}] ERROR loading: ${frameIndex}`);
    const imageState = this.imageStates[frameIndex];
    imageState.status = "failed";
    this.loadNextImages(1); // Continue loading despite the failure
  }

  loadNextImages(count) {
    this.isLoadingBatch = true;
    while (count > 0 && this.loadQueue.length) {
      const frameIndex = this.loadQueue.shift();
      const entry = this.imageStates[frameIndex];
      if (!entry || entry?.status === "failed") {
        this.loadImage(frameIndex);
        count--;
      }
    }
  }

  loadImage(frameIndex) {
    const image = new Image();
    const fileName = `${this.baseName}-${frameIndex
      .toString()
      .padStart(4, "0")}.${this.fileExt}`;
    console.log(`LOADING....... ${fileName}`);
    image.src = `${this.assetPath}/${fileName}`;
    const imageState = (this.imageStates[frameIndex] = {
      status: "loading",
      image,
    });

    image.onload = () => this.handleOnLoad(frameIndex);
    image.onerror = () => this.handleOnError(frameIndex);
  }

  render(frameIndex) {
    // if (frameIndex !== this.frames.frame) return;
    console.log(`[${this.id}] render: ${frameIndex}, ${this.requestedFrame}`);

    const imageState = this.imageStates[frameIndex];
    if (imageState?.status === "loaded" && imageState.image) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(
        imageState.image,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
  }

  goToFrame(index) {
    this.requestedFrame = index;
    if (!this.isFullyLoaded)
      this.loadQueue = getLoadQueue(index, this.indexStart, this.indexEnd);
    if (!this.isFirstBatchLoading) this.loadNextImages(this.BATCH_SIZE); // Load initial batch

    this.render(index);
  }

  cleanup() {
    console.log(`[${this.id}] Cleanup`);
    this.isUnmounted = true;
  }
}

function getLoadQueue(currentFrame, minFrame, maxFrame) {
  let frames = [];
  let maxDistance = Math.max(currentFrame - minFrame, maxFrame - currentFrame);

  // Create the array expanding outward from the current frame
  for (let i = 0; i <= maxDistance; i++) {
    // Check the lower side
    if (currentFrame - i >= minFrame) {
      frames.push(currentFrame - i);
    }
    // Check the upper side, avoid duplication of the current frame
    if (i !== 0 && currentFrame + i <= maxFrame) {
      frames.push(currentFrame + i);
    }
  }

  return frames;
}

export default FrameLoader;
