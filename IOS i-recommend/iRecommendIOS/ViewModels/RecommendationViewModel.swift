import Foundation
import AVFoundation

@MainActor
final class RecommendationViewModel: ObservableObject {
    @Published var playlists: [PlaylistModel] = []
    @Published var tracks: [RecommendedTrack] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let musicService = AppleMusicService()
    private var player: AVPlayer?

    func connectAndLoad() async {
        isLoading = true
        errorMessage = nil

        do {
            try await musicService.requestAuthorization()
            playlists = try await musicService.fetchLibraryPlaylists()
            tracks = try await musicService.fetchRecommendations(from: playlists)
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func playPreview(for track: RecommendedTrack) {
        guard let previewURL = track.previewURL else {
            return
        }

        player = AVPlayer(url: previewURL)
        player?.play()
    }

    func stopPreview() {
        player?.pause()
        player = nil
    }
}
